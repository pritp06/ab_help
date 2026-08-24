def test_register_user_success(client):
    payload = {
        "email": "Test.Student@Example.com",
        "password": "securepassword123",
        "first_name": "Test",
        "last_name": "Student"
    }
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 201
    data = res.json()["data"]["user"]
    assert data["email"] == "test.student@example.com"
    assert data["first_name"] == "Test"
    assert "study_abroad_session" in res.cookies


def test_register_duplicate_email(client):
    payload = {
        "email": "duplicate@example.com",
        "password": "password12345"
    }
    client.post("/api/v1/auth/register", json=payload)
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 409
    assert "already exists" in res.json()["error"]["message"]


def test_login_success(client):
    reg_payload = {
        "email": "logintest@example.com",
        "password": "mypassword123"
    }
    client.post("/api/v1/auth/register", json=reg_payload)

    login_payload = {
        "email": "LOGINTEST@example.com",
        "password": "mypassword123"
    }
    res = client.post("/api/v1/auth/login", json=login_payload)
    assert res.status_code == 200
    assert "study_abroad_session" in res.cookies
    assert res.json()["data"]["user"]["email"] == "logintest@example.com"


def test_login_invalid_password(client):
    reg_payload = {
        "email": "wrongpass@example.com",
        "password": "correctpassword123"
    }
    client.post("/api/v1/auth/register", json=reg_payload)

    login_payload = {
        "email": "wrongpass@example.com",
        "password": "incorrectpassword"
    }
    res = client.post("/api/v1/auth/login", json=login_payload)
    assert res.status_code == 401
    assert res.json()["error"]["message"] == "Invalid email or password."


def test_get_me_unauthenticated(client):
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 401


def test_logout(client):
    reg_payload = {
        "email": "logouttest@example.com",
        "password": "mypassword123"
    }
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    cookie = reg_res.cookies.get("study_abroad_session")

    logout_res = client.post("/api/v1/auth/logout", cookies={"study_abroad_session": cookie})
    assert logout_res.status_code == 200
    assert logout_res.json()["data"]["logged_out"] is True

    # Me after logout should fail
    me_res = client.get("/api/v1/auth/me", cookies={"study_abroad_session": cookie})
    assert me_res.status_code == 401
