import logging
from flask import Flask
from app.api.usuarios import api as usuarios_api

logger = logging.getLogger(__name__)

def registrar_blueprints_api(app: Flask):
    logger.info("Registrando blueprints de la API")
    app.register_blueprint(usuarios_api)