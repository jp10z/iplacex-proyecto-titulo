import logging
from flask import Blueprint, g, request
from oracledb import Connection
from app.maestros import ESTADOS
from app.crud import dashboard as crud_dashboard

api = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")

logger = logging.getLogger(__name__)

@api.route("/estados/<int:id_proyecto>", methods=["GET"])
def obtener_estados_servidores(id_proyecto: int):
    logger.info("Obteniendo estados de servidores desde la BD")
    # Obtener servidores desde la BD
    servidores = crud_dashboard.obtener_estados_servidores(
        g.bd_conexion,
        id_proyecto
    )
    # Formatear resultados
    items = []
    for fila in servidores:
        items.append({
            "id": fila[0],
            "nombre": fila[1],
            "nombre_proyecto": fila[2],
            "fecha_acceso": fila[3].isoformat() if fila[3] else None,
            "duracion_minutos": fila[4],
        })
    return {"items": items}, 200