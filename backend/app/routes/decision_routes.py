from flask import Blueprint, request

from app.schemas.decision_schema import (
    serialize_decision,
    validate_decision_payload,
    validate_outcome_payload,
)
from app.services.decision_service import (
    create_decision,
    get_decision_or_404,
    list_decisions,
    upsert_decision_outcome,
)
from app.services.errors import ValidationError

decision_bp = Blueprint("decisions", __name__)


@decision_bp.post("/decisions")
def create_decision_route():
    payload = request.get_json(silent=True) or {}
    validated_data = validate_decision_payload(payload)
    decision = create_decision(validated_data)
    return serialize_decision(decision), 201


@decision_bp.get("/decisions")
def list_decisions_route():
    outcome = request.args.get("outcome")
    confidence_raw = request.args.get("confidence_level")
    confidence_level = None

    if confidence_raw is not None and confidence_raw != "":
        try:
            confidence_level = int(confidence_raw)
        except ValueError as error:
            raise ValidationError("'confidence_level' must be an integer") from error

        if confidence_level < 1 or confidence_level > 5:
            raise ValidationError("'confidence_level' must be between 1 and 5")

    decisions = list_decisions(outcome=outcome, confidence_level=confidence_level)
    return {"items": [serialize_decision(item) for item in decisions]}, 200


@decision_bp.get("/decisions/<int:decision_id>")
def get_decision_route(decision_id: int):
    decision = get_decision_or_404(decision_id)
    return serialize_decision(decision), 200


@decision_bp.put("/decisions/<int:decision_id>/outcome")
def add_outcome_route(decision_id: int):
    payload = request.get_json(silent=True) or {}
    validated_data = validate_outcome_payload(payload)
    decision = upsert_decision_outcome(decision_id, validated_data)
    return serialize_decision(decision), 200
