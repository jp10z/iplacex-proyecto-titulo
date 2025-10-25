import logging
from flask import Blueprint, g
from oracledb import Connection

api = Blueprint('test', __name__, url_prefix="/api/test")

logger = logging.getLogger(__name__)

@api.route('/estados', methods=['GET'])
def obtener_estados():
    logger.info("Prueba - obtener estados desde la BD")
    bd_conexion: Connection = g.bd_conexion
    cursor = bd_conexion.cursor()
    cursor.execute("SELECT id_estado, codigo FROM estado")
    resultados = cursor.fetchall()
    cursor.close()
    return {"estados": resultados}