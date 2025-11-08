import logging
from flask import Blueprint, g, request
from oracledb import Connection
from app.maestros import TIPOS_EVENTO
from app.crud import dashboard as crud_dashboard
from app.crud import servidores as crud_servidores
from app.crud import eventos as crud_eventos

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

@api.route("/detalles/<int:id_servidor>", methods=["GET"])
def obtener_detalles_acceso_servidor(id_servidor: int):
    logger.info(f"Obteniendo detalles de acceso del servidor {id_servidor} desde la BD")
    # Obtener detalles desde la BD
    detalles = crud_dashboard.obtener_detalles_acceso_servidor(
        g.bd_conexion,
        id_servidor
    )
    if detalles is None:
        return {"status": "error", "mensaje": "Servidor no encontrado"}, 404
    # Formatear resultado
    item = {
        "id_servidor": detalles[0],
        "nombre_servidor": detalles[1],
        "descripcion_servidor": detalles[2],
        "nombre_proyecto": detalles[3],
        "fecha_acceso": detalles[4].isoformat() if detalles[4] else None,
        "duracion_minutos": detalles[5],
        "notas": detalles[6],
        "id_usuario": detalles[7],
        "nombre_usuario": detalles[8],
    }
    return {"item": item}, 200

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
    # obtener servidor
    servidor = crud_servidores.obtener_servidor_por_id(bd_conexion, id_servidor)
    if servidor is None:
        return {"status": "error", "mensaje": "El servidor no existe"}, 422
    # insertar o actualizar acceso en la BD
    crud_dashboard.agregar_acceso(bd_conexion, id_servidor, id_usuario, duracion_minutos, notas)
    crud_eventos.agregar_evento(
        bd_conexion,
        TIPOS_EVENTO.SERVIDOR_ACCESO,
        id_usuario,
        id_servidor,
        f"Acceso al servidor por {duracion_minutos} minutos",
        {
            "id_servidor": id_servidor,
            "id_usuario": id_usuario,
            "duracion_minutos": duracion_minutos,
            "notas": notas,
            "nombre_servidor": servidor[1],
        }
    )
    bd_conexion.commit()
    return {"status": "success", "mensaje": "Acceso configurado correctamente"}, 201