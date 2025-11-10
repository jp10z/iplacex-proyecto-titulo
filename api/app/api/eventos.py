import logging, json
from flask import Blueprint, g, request
from app.crud import eventos as crud_eventos
from app.maestros import ROLES
from app import sesion

api = Blueprint("eventos", __name__, url_prefix="/api/eventos")

logger = logging.getLogger(__name__)

@api.route("", methods=["GET"])
@sesion.ruta_protegida([ROLES.ADMIN])
def obtener_eventos():
    logger.info("Obteniendo eventos desde la BD")
    # obtener parametros desde la request
    texto_busqueda = request.args.get("buscar", "").strip()
    pagina_index = int(request.args.get("paginaIndex", "1"))
    pagina_size = int(request.args.get("paginaSize", "10"))
    id_tipo_evento = request.args.get("idTipoEvento", "")
    id_tipo_evento = int(id_tipo_evento) if id_tipo_evento else None
    id_usuario = request.args.get("idUsuario", "")
    id_usuario = int(id_usuario) if id_usuario else None
    id_servidor = request.args.get("idServidor", "")
    id_servidor = int(id_servidor) if id_servidor else None
    fecha_desde = request.args.get("fechaDesde", "").strip()
    fecha_hasta = request.args.get("fechaHasta", "").strip()
    if fecha_desde == "" or fecha_hasta == "":
        return {"status": "error", "mensaje": "Debe proporcionar fechaDesde y fechaHasta"}, 422
    logger.debug(f"Buscando eventos con texto: '{texto_busqueda}'")
    # Obtener eventos desde la BD
    eventos, total = crud_eventos.obtener_eventos_con_paginacion(
        g.bd_conexion,
        pagina_index,
        pagina_size,
        texto_busqueda,
        id_tipo_evento,
        id_usuario,
        id_servidor,
        fecha_desde,
        fecha_hasta
    )
    # Formatear resultados
    items = []
    for fila in eventos:
        items.append({
            "id": fila[0],
            "nombre_tipo_evento": fila[1],
            "detalle": fila[2],
            "fecha_creacion": fila[3].isoformat().replace("T", " ") if fila[3] else None,
            "nombre_usuario": fila[4],
            "nombre_servidor": fila[5],
        })
    return {"items": items, "total": total}, 200

@api.route("/<int:id_evento>", methods=["GET"])
@sesion.ruta_protegida([ROLES.ADMIN])
def obtener_datos_evento(id_evento: int):
    logger.info(f"Obteniendo datos de evento con ID: {id_evento}")
    evento = crud_eventos.obtener_datos_evento(g.bd_conexion, id_evento)
    if not evento:
        return {"status": "error", "mensaje": "Evento no encontrado"}, 404
    item = {
        "id": evento[0],
        "nombre_tipo_evento": evento[1],
        "detalle": evento[2],
        "fecha_creacion": evento[3].isoformat().replace("T", " ") if evento[3] else None,
        "nombre_usuario": evento[4],
        "nombre_servidor": evento[5],
        "datos": json.loads(evento[6]) if evento[6] else None,
    }
    return {"item": item}, 200