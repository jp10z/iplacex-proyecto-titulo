import logging, os
from app.configs.env import cargar_archivo_env
from app.configs.logger import configurar_logger
from app.configs.database import inicializar_bd
from oracledb import ConnectionPool
from app.common import utils
from flask import Flask, g
from flask_cors import CORS
from app.api import registrar_blueprints_api

logger = logging.getLogger(__name__)

# inicializar configuraciones base
cargar_archivo_env()
configurar_logger()

# inicializar flask
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", utils.generar_texto_aleatorio(32))
app.config["CORS_HEADERS"] = "Content-Type"
web_url = os.getenv("WEB_URL")
if not web_url:
    raise ValueError("La variable de entorno WEB_URL no está configurada")
app.config["DEBUG"] = os.getenv("DEBUG", "0") == "1"
CORS(app, supports_credentials=True, origins=[web_url])

# inicialiar base de datos
db_pool: ConnectionPool = inicializar_bd()
@app.before_request
def get_db_connection():
    global db_pool
    g.bd_conexion = db_pool.acquire()
@app.teardown_request
def release_db_connection(exception):
    conn = g.pop('bd_conexion', None)
    if conn is not None:
        db_pool.release(conn)

# registrar blueprints
registrar_blueprints_api(app)

# API lista
logger.info("API lista")