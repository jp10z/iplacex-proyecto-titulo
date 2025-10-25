import logging
from flask import Flask
from app.api.test import api as test_api

logger = logging.getLogger(__name__)

def registrar_blueprints_api(app: Flask):
    logger.info("Registrando blueprints de la API")
    app.register_blueprint(test_api)