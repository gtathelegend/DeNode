from datetime import datetime

from sqlalchemy import CheckConstraint

from app.extensions import db


class Decision(db.Model):
    __tablename__ = "decisions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(64), nullable=False, default="local-user")
    title = db.Column(db.String(255), nullable=False)
    context = db.Column(db.Text, nullable=False)
    options_considered = db.Column(db.Text, nullable=True)
    confidence_level = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        CheckConstraint("confidence_level BETWEEN 1 AND 5", name="ck_confidence_level"),
    )

    outcome = db.relationship(
        "DecisionOutcome",
        back_populates="decision",
        uselist=False,
        cascade="all, delete-orphan",
    )


class DecisionOutcome(db.Model):
    __tablename__ = "decision_outcomes"

    id = db.Column(db.Integer, primary_key=True)
    decision_id = db.Column(db.Integer, db.ForeignKey("decisions.id"), nullable=False, unique=True)
    result = db.Column(db.String(20), nullable=False)
    reflection_notes = db.Column(db.Text, nullable=False)
    lessons_learned = db.Column(db.Text, nullable=False)
    reviewed_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        CheckConstraint(
            "result IN ('success', 'neutral', 'failure')",
            name="ck_outcome_result",
        ),
    )

    decision = db.relationship("Decision", back_populates="outcome")
