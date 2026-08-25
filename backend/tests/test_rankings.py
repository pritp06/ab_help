def test_get_top_universities(client):
    res = client.get("/api/v1/universities/top?provider=QS&year=2027&limit=200")
    assert res.status_code == 200
    data = res.json()
    assert "data" in data
    assert "meta" in data
    assert data["meta"]["provider"] == "QS"
    assert data["meta"]["year"] == 2027
    assert len(data["data"]) > 0

    # Verify rank 1 is MIT
    first = data["data"][0]
    assert first["rank"] == 1
    assert first["rank_display"] == "1"
    assert first["university"]["slug"] == "massachusetts-institute-of-technology-mit"


def test_tied_ranks_preserved(client):
    res = client.get("/api/v1/universities/top?provider=QS&year=2027")
    assert res.status_code == 200
    data = res.json()["data"]

    # Filter for rank 2
    rank2_items = [u for u in data if u["rank"] == 2]
    assert len(rank2_items) == 2
    for item in rank2_items:
        assert item["rank_display"] == "=2"
        assert item["rank_status"] == "tied"


def test_filter_by_country(client):
    res = client.get("/api/v1/universities/top?country=Germany")
    assert res.status_code == 200
    data = res.json()["data"]
    assert len(data) > 0
    for item in data:
        assert item["university"]["country"]["name"] == "Germany"


def test_filter_by_region(client):
    res = client.get("/api/v1/universities/top?region=Europe")
    assert res.status_code == 200
    data = res.json()["data"]
    assert len(data) > 0
    for item in data:
        assert item["university"]["country"]["region"] == "Europe"


def test_search_universities(client):
    res = client.get("/api/v1/universities/top?search=TUM")
    assert res.status_code == 200
    data = res.json()["data"]
    assert len(data) > 0
    assert "Technical University of Munich" in data[0]["university"]["name"]


def test_university_detail_ranking(client):
    res = client.get("/api/v1/universities/technical-university-of-munich")
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["name"] == "Technical University of Munich"
    assert data["ranking"] is not None
    assert data["ranking"]["rank"] == 25
    assert float(data["ranking"]["score"]) == 89.1
