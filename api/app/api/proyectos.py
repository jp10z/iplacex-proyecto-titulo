import logging
from flask import Blueprint, g, request
from oracledb import Connection
from app.maestros import ESTADOS, TIPOS_EVENTO, ROLES
from app.crud import proyectos as crud_proyectos
from app.crud import eventos as crud_eventos
from app import sesion

api = Blueprint("proyectos", __name__, url_prefix="/api/proyectos")

logger = logging.getLogger(__name__)

@api.route("", methods=["GET"])
@sesion.ruta_protegida([ROLES.ADMIN])
def obtener_proyectos():
    logger.info("Obteniendo proyectos desde la BD")
    # obtener parametros desde la request
    texto_busqueda = request.args.get("buscar", "").strip()
    pagina_index = int(request.args.get("paginaIndex", "1"))
    pagina_size = int(request.args.get("paginaSize", "10"))
    logger.debug(f"Buscando proyectos con texto: '{texto_busqueda}'")
    # Obtener proyectos desde la BD
    proyectos, total = crud_proyectos.obtener_proyectos_con_paginacion(
        g.bd_conexion,
        pagina_index,
        pagina_size,
        texto_busqueda
    )
    # Formatear resultados
    items = []
    for fila in proyectos:
        items.append({
            "id": fila[0],
            "nombre": fila[1],
            "descripcion": fila[2],
            "servidores": fila[3],
        })
    return {"items": items, "total": total}, 200

@api.route("", methods=["POST"])
@sesion.ruta_protegida([ROLES.ADMIN])
def agregar_proyecto():
    logger.info("Agregar proyecto")
    # obtener datos desde la request
    datos: dict = request.get_json()
    if not datos or "nombre" not in datos or "descripcion" not in datos:
        return {"status": "error", "mensaje": "Debe completar todos los campos"}, 422
    nombre: str = datos.get("nombre", "").strip()
    descripcion: str = datos.get("descripcion", "").strip()
    # obtener conexión a la BD
    bd_conexion: Connection = g.bd_conexion
    # validar si el proyecto ya existe
    proyecto_existente = crud_proyectos.obtener_proyecto_por_nombre(bd_conexion, nombre)
    if proyecto_existente is not None:
        return {"status": "error", "mensaje": "El nombre ya está en uso"}, 422
    # insertar en la BD
    id_proyecto = crud_proyectos.agregar_proyecto(bd_conexion, nombre, descripcion)
    crud_eventos.agregar_evento(
        bd_conexion,
        TIPOS_EVENTO.PROYECTO_AGREGAR,
        None,
        None,
        f"Proyecto agregado: {nombre}",
        {
            "id_proyecto": id_proyecto,
            "nombre": nombre,
            "descripcion": descripcion
        }
    )
    bd_conexion.commit()
    return {"status": "success", "mensaje": "Proyecto agregado correctamente"}, 201

@api.route("/<int:id_proyecto>", methods=["PUT"])
@sesion.ruta_protegida([ROLES.ADMIN])
def modificar_proyecto(id_proyecto: int):
    logger.info(f"Modificando proyecto {id_proyecto}")
    # obtener datos desde la request
    datos: dict = request.get_json()
    if not datos or "nombre" not in datos or "descripcion" not in datos:
        return {"status": "error", "mensaje": "Debe completar todos los campos"}, 422
    nombre: str = datos.get("nombre", "").strip()
    descripcion: str = datos.get("descripcion", "").strip()
    # obtener conexión a la BD
    bd_conexion: Connection = g.bd_conexion
    # validar si el proyecto ya existe en otro proyecto (que no sea el mismo)
    proyecto_existente = crud_proyectos.obtener_proyecto_por_nombre(bd_conexion, nombre)
    if proyecto_existente is not None and proyecto_existente[0] != id_proyecto:
        return {"status": "error", "mensaje": "El nombre ya está en uso por otro proyecto"}, 422
    # actualizar proyecto en la BD
    crud_proyectos.modificar_proyecto(bd_conexion, id_proyecto, nombre, descripcion)
    crud_eventos.agregar_evento(
        bd_conexion,
        TIPOS_EVENTO.PROYECTO_MODIFICAR,
        None,
        None,
        f"Proyecto modificado: {nombre}",
        {
            "id_proyecto": id_proyecto,
            "datos_anteriores": {
                "nombre": proyecto_existente[1],
                "descripcion": proyecto_existente[2]
            },
            "datos_nuevos": {
                "nombre": nombre,
                "descripcion": descripcion
            }
        }
    )
    bd_conexion.commit()
    return {"status": "success", "mensaje": "Proyecto modificado correctamente"}, 200

@api.route("/<int:id_proyecto>", methods=["DELETE"])
@sesion.ruta_protegida([ROLES.ADMIN])
def deshabilitar_proyecto(id_proyecto: int):
    logger.info(f"Deshabilitando proyecto {id_proyecto}")
    # obtener conexión a la BD
    bd_conexion: Connection = g.bd_conexion
    proyecto = crud_proyectos.obtener_proyecto_por_id(bd_conexion, id_proyecto)
    # actualizar estado del proyecto
    crud_proyectos.actualizar_estado_proyecto(bd_conexion, id_proyecto, ESTADOS.INACTIVO)
    crud_eventos.agregar_evento(
        bd_conexion,
        TIPOS_EVENTO.PROYECTO_DESHABILITAR,
        None,
        None,
        f"Proyecto deshabilitado: {proyecto[1]}",
        {
            "id_proyecto": id_proyecto,
            "nombre": proyecto[1],
            "descripcion": proyecto[2]
        }
    )
    bd_conexion.commit()
    return {"status": "success", "mensaje": "Proyecto deshabilitado correctamente"}, 200

@api.route("lista", methods=["GET"])
@sesion.ruta_protegida([ROLES.ADMIN])
def obtener_lista_proyectos():
    logger.info("Obteniendo lista de proyectos")
    # obtener conexión a la BD
    bd_conexion: Connection = g.bd_conexion
    # obtener proyectos desde la BD (formato lista)
    proyectos = crud_proyectos.obtener_lista_proyectos(bd_conexion)
    # formatear resultados
    items = []
    for fila in proyectos:
        items.append({
            "id_proyecto": fila[0],
            "nombre": fila[1],
        })
    return {"items": items}, 200