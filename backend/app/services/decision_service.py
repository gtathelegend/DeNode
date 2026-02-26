from app.extensions import db
from app.models import Decision, DecisionOutcome
from app.services.errors import NotFoundError, ValidationError

ALLOWED_RESULTS = {"success", "neutral", "failure"}


def create_decision(data: dict) -> Decision:
    decision = Decision(**data)
    db.session.add(decision)
    db.session.commit()
    return decision


def list_decisions(outcome: str | None = None, confidence_level: int | None = None) -> list[Decision]:
    query = Decision.query.order_by(Decision.created_at.desc())

    if confidence_level is not None:
        query = query.filter(Decision.confidence_level == confidence_level)

    if outcome:
        if outcome not in ALLOWED_RESULTS:
            raise ValidationError("'outcome' filter must be one of: success, neutral, failure")
        query = query.join(Decision.outcome).filter(DecisionOutcome.result == outcome)

    return query.all()


def get_decision_or_404(decision_id: int) -> Decision:
    decision = db.session.get(Decision, decision_id)
    if not decision:
        raise NotFoundError(f"Decision with id={decision_id} was not found")
    return decision


def upsert_decision_outcome(decision_id: int, data: dict) -> Decision:
    decision = get_decision_or_404(decision_id)

    if decision.outcome:
        decision.outcome.result = data["result"]
        decision.outcome.reflection_notes = data["reflection_notes"]
        decision.outcome.lessons_learned = data["lessons_learned"]
        if data.get("reviewed_at"):
            decision.outcome.reviewed_at = data["reviewed_at"]
    else:
        outcome_data = {
            "decision_id": decision.id,
            "result": data["result"],
            "reflection_notes": data["reflection_notes"],
            "lessons_learned": data["lessons_learned"],
        }
        if data.get("reviewed_at"):
            outcome_data["reviewed_at"] = data["reviewed_at"]

        db.session.add(DecisionOutcome(**outcome_data))

    db.session.commit()
    db.session.refresh(decision)
    return decision
