from datetime import datetime

from app.models import Decision, DecisionOutcome
from app.services.errors import ValidationError

ALLOWED_RESULTS = {"success", "neutral", "failure"}


def validate_decision_payload(payload: dict) -> dict:
    required_fields = ["title", "context", "confidence_level"]
    for field in required_fields:
        if field not in payload or payload[field] in (None, ""):
            raise ValidationError(f"'{field}' is required")

    confidence_level = payload.get("confidence_level")
    if not isinstance(confidence_level, int) or not 1 <= confidence_level <= 5:
        raise ValidationError("'confidence_level' must be an integer between 1 and 5")

    return {
        "title": str(payload["title"]).strip(),
        "context": str(payload["context"]).strip(),
        "options_considered": (str(payload.get("options_considered", "")).strip() or None),
        "confidence_level": confidence_level,
        "user_id": str(payload.get("user_id", "local-user")).strip() or "local-user",
    }


def validate_outcome_payload(payload: dict) -> dict:
    required_fields = ["result", "reflection_notes", "lessons_learned"]
    for field in required_fields:
        if field not in payload or payload[field] in (None, ""):
            raise ValidationError(f"'{field}' is required")

    result = str(payload["result"]).strip().lower()
    if result not in ALLOWED_RESULTS:
        raise ValidationError("'result' must be one of: success, neutral, failure")

    reviewed_at = payload.get("reviewed_at")
    parsed_reviewed_at = None
    if reviewed_at:
        try:
            parsed_reviewed_at = datetime.fromisoformat(str(reviewed_at))
        except ValueError as error:
            raise ValidationError("'reviewed_at' must be a valid ISO datetime") from error

    return {
        "result": result,
        "reflection_notes": str(payload["reflection_notes"]).strip(),
        "lessons_learned": str(payload["lessons_learned"]).strip(),
        "reviewed_at": parsed_reviewed_at,
    }


def serialize_decision(decision: Decision) -> dict:
    return {
        "id": decision.id,
        "user_id": decision.user_id,
        "title": decision.title,
        "context": decision.context,
        "options_considered": decision.options_considered,
        "confidence_level": decision.confidence_level,
        "created_at": decision.created_at.isoformat(),
        "outcome": serialize_outcome(decision.outcome) if decision.outcome else None,
    }


def serialize_outcome(outcome: DecisionOutcome) -> dict:
    return {
        "result": outcome.result,
        "reflection_notes": outcome.reflection_notes,
        "lessons_learned": outcome.lessons_learned,
        "reviewed_at": outcome.reviewed_at.isoformat(),
    }
