import logging
from flask import Flask
from app.api.usuarios import api as usuarios_api
from app.api.proyectos import api as proyectos_api
from app.api.servidores import api as servidores_api
from app.api.dashboard import api as dashboard_api
from app.api.eventos import api as eventos_api

logger = logging.getLogger(__name__)

def registrar_blueprints_api(app: Flask):
    logger.info("Registrando blueprints de la API")
    app.register_blueprint(usuarios_api)
    app.register_blueprint(proyectos_api)
    app.register_blueprint(servidores_api)
    app.register_blueprint(dashboard_api)
    app.register_blueprint(eventos_api)