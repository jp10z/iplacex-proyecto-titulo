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

@api.route("/acceso", methods=["POST"])
def agregar_acceso():
    logger.info("Agregar acceso a servidor")
    # obtener datos desde la request
    datos: dict = request.get_json()
    if not datos or "id_servidor" not in datos or "id_usuario" not in datos or "duracion_minutos" not in datos or "notas" not in datos:
        return {"status": "error", "mensaje": "Debe completar todos los campos"}, 422
    id_servidor: int = datos.get("id_servidor", 0)
    id_usuario: int = datos.get("id_usuario", 0)
    duracion_minutos: int = datos.get("duracion_minutos", 0)
    notas: str = datos.get("notas", "").strip()
    # obtener conexión a la BD
    bd_conexion: Connection = g.bd_conexion
    # insertar o actualizar acceso en la BD
    crud_dashboard.agregar_acceso(bd_conexion, id_servidor, id_usuario, duracion_minutos, notas)
    bd_conexion.commit()
    return {"status": "success", "mensaje": "Acceso configurado correctamente"}, 201