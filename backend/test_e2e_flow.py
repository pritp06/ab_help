import httpx

BASE_URL = "http://127.0.0.1:8000"

def run_e2e_test():
    with httpx.Client(base_url=BASE_URL, follow_redirects=True, timeout=30.0) as client:
        # 1. Health check
        h = client.get("/health").json()
        print("1. Health check:", h)
        assert h["status"] == "healthy"

        # 2. Register
        reg_payload = {
            "email": "e2e_student_demo@example.com",
            "password": "securepassword123",
            "first_name": "Alex",
            "last_name": "Morgan"
        }
        reg_res = client.post("/api/v1/auth/register", json=reg_payload)
        print("2. Register HTTP status:", reg_res.status_code)
        reg_json = reg_res.json()
        print("   Registered User:", reg_json["data"]["user"])
        assert reg_res.status_code == 201
        assert reg_json["data"]["user"]["email"] == "e2e_student_demo@example.com"

        # 3. GET /me (Cookie session check)
        me_res = client.get("/api/v1/auth/me")
        print("3. GET /me status:", me_res.status_code)
        print("   User from /me:", me_res.json()["data"]["user"]["email"])
        assert me_res.status_code == 200

        # 4. Update Profile
        prof_payload = {
            "first_name": "Alex",
            "last_name": "Morgan",
            "country_of_residence": "Germany",
            "current_degree": "Bachelor of Science",
            "field": "Computer Science",
            "gpa": 8.2,
            "gpa_scale": 10.0,
            "budget_amount": 20000
        }
        put_res = client.put("/api/v1/profile", json=prof_payload)
        print("4. Update Profile status:", put_res.status_code)
        put_json = put_res.json()
        print("   Updated Profile:", put_json["first_name"], put_json["country_of_residence"], put_json["gpa"])
        assert put_res.status_code == 200
        assert put_json["country_of_residence"] == "Germany"

        # 5. Logout
        logout_res = client.post("/api/v1/auth/logout")
        print("5. Logout status:", logout_res.status_code)
        assert logout_res.status_code == 200

        # 6. GET /me after logout (Should fail 401)
        me_after_logout = client.get("/api/v1/auth/me")
        print("6. GET /me after logout status:", me_after_logout.status_code)
        assert me_after_logout.status_code == 401

        # 7. Login again
        login_payload = {
            "email": "e2e_student_demo@example.com",
            "password": "securepassword123"
        }
        login_res = client.post("/api/v1/auth/login", json=login_payload)
        print("7. Login again status:", login_res.status_code)
        assert login_res.status_code == 200

        # 8. Restore profile from DB
        get_prof_res = client.get("/api/v1/profile")
        print("8. Restored Profile from DB status:", get_prof_res.status_code)
        restored = get_prof_res.json()
        print("   Restored Country:", restored["country_of_residence"], "GPA:", restored["gpa"], "Budget:", restored["budget_amount"])
        assert restored["country_of_residence"] == "Germany"
        assert float(restored["gpa"]) == 8.2

        print("\n🎉 ALL END-TO-END TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_e2e_test()
