import logging
from flask import Blueprint, g
from oracledb import Connection
from app.maestros import ESTADOS

api = Blueprint('usuarios', __name__, url_prefix="/api/usuarios")

logger = logging.getLogger(__name__)

@api.route('/', methods=['GET'])
def obtener_usuarios():
    logger.info("Obteniendo usuarios desde la BD")
    # Obtener usuarios desde la BD
    bd_conexion: Connection = g.bd_conexion
    cursor = bd_conexion.cursor()
    query = """
        SELECT u.id_usuario, u.correo, u.nombre, r.nombre AS rol
        FROM usuario u
        INNER JOIN rol r
            ON u.id_rol = r.id_rol
        WHERE u.id_estado = :id_estado
    """
    query_vars = {
        "id_estado": ESTADOS.ACTIVO
    }
    cursor.execute(query, query_vars)
    resultados = cursor.fetchall()
    cursor.close()
    # Formatear resultados
    datos = []
    for fila in resultados:
        datos.append({
            "id": fila[0],
            "correo": fila[1],
            "nombre": fila[2],
            "rol": fila[3],
        })
    return {"datos": datos, "total": len(datos)}, 200