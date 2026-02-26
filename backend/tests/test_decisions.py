import pytest

from app import create_app
from app.extensions import db


@pytest.fixture()
def client():
    app = create_app(
        {
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        }
    )

    with app.app_context():
        db.create_all()

    with app.test_client() as test_client:
        yield test_client

    with app.app_context():
        db.session.remove()
        db.drop_all()


def test_create_and_get_decision(client):
    create_response = client.post(
        "/decisions",
        json={
            "title": "Launch side project",
            "context": "Need to pick one idea this week",
            "confidence_level": 4,
        },
    )

    assert create_response.status_code == 201
    decision = create_response.get_json()
    decision_id = decision["id"]

    get_response = client.get(f"/decisions/{decision_id}")
    assert get_response.status_code == 200
    fetched = get_response.get_json()
    assert fetched["title"] == "Launch side project"


def test_add_outcome(client):
    create_response = client.post(
        "/decisions",
        json={
            "title": "Switch testing framework",
            "context": "Current framework is slowing CI",
            "confidence_level": 3,
        },
    )
    decision_id = create_response.get_json()["id"]

    outcome_response = client.put(
        f"/decisions/{decision_id}/outcome",
        json={
            "result": "success",
            "reflection_notes": "Migration was straightforward",
            "lessons_learned": "Run both suites in parallel first",
        },
    )

    assert outcome_response.status_code == 200
    payload = outcome_response.get_json()
    assert payload["outcome"]["result"] == "success"
