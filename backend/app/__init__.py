from flask import Flask, jsonify
from flask_cors import CORS

from .extensions import db
from .routes.decision_routes import decision_bp
from .services.errors import NotFoundError, ValidationError


def create_app(config: dict | None = None) -> Flask:
    app = Flask(__name__)
    app.config.update(
        SQLALCHEMY_DATABASE_URI="sqlite:///denode.db",
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    if config:
        app.config.update(config)

    db.init_app(app)
    CORS(app, resources={r"/*": {"origins": "*"}})

    with app.app_context():
        db.create_all()

    app.register_blueprint(decision_bp)

    register_error_handlers(app)

    @app.get("/health")
    def health_check():
        return {"status": "ok"}, 200

    return app


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(ValidationError)
    def handle_validation_error(error: ValidationError):
        return jsonify({"error": error.message}), 400

    @app.errorhandler(NotFoundError)
    def handle_not_found_error(error: NotFoundError):
        return jsonify({"error": error.message}), 404

    @app.errorhandler(404)
    def handle_route_not_found(_error):
        return jsonify({"error": "Route not found"}), 404

    @app.errorhandler(500)
    def handle_internal_server_error(_error):
        return jsonify({"error": "Internal server error"}), 500
