def test_get_and_update_profile(client):
    reg_payload = {
        "email": "profiletest@example.com",
        "password": "mypassword123",
        "first_name": "Initial",
        "last_name": "Name"
    }
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    cookie = reg_res.cookies.get("study_abroad_session")

    # 1. Get profile
    get_res = client.get("/api/v1/profile", cookies={"study_abroad_session": cookie})
    assert get_res.status_code == 200
    assert get_res.json()["first_name"] == "Initial"

    # 2. Update profile
    update_payload = {
        "first_name": "Updated",
        "last_name": "Student",
        "country_of_residence": "Germany",
        "current_degree": "Bachelor's",
        "field": "Computer Science",
        "gpa": 7.8,
        "gpa_scale": 10.0,
        "budget_amount": 18000
    }
    put_res = client.put("/api/v1/profile", json=update_payload, cookies={"study_abroad_session": cookie})
    assert put_res.status_code == 200
    updated = put_res.json()
    assert updated["first_name"] == "Updated"
    assert updated["country_of_residence"] == "Germany"
    assert float(updated["gpa"]) == 7.8
    assert updated["budget_amount"] == 18000


def test_profile_unauthenticated(client):
    res = client.get("/api/v1/profile")
    assert res.status_code == 401
