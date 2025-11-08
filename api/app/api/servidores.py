import logging
from flask import Blueprint, g, request
from oracledb import Connection
from app.maestros import ESTADOS, TIPOS_EVENTO
from app.crud import servidores as crud_servidores
from app.crud import proyectos as crud_proyectos
from app.crud import eventos as crud_eventos

api = Blueprint("servidores", __name__, url_prefix="/api/servidores")

logger = logging.getLogger(__name__)

@api.route("", methods=["GET"])
def obtener_servidores():
    logger.info("Obteniendo servidores desde la BD")
    # obtener parametros desde la request
    texto_busqueda = request.args.get("buscar", "").strip()
    pagina_index = int(request.args.get("paginaIndex", "1"))
    pagina_size = int(request.args.get("paginaSize", "10"))
    id_proyecto = request.args.get("idProyecto", "")
    id_proyecto = int(id_proyecto) if id_proyecto else None
    logger.debug(f"Buscando servidores con texto: '{texto_busqueda}'")
    # Obtener servidores desde la BD
    servidores, total = crud_servidores.obtener_servidores_con_paginacion(
        g.bd_conexion,
        pagina_index,
        pagina_size,
        texto_busqueda,
        id_proyecto
    )
    # Formatear resultados
    items = []
    for fila in servidores:
        items.append({
            "id": fila[0],
            "nombre": fila[1],
            "descripcion": fila[2],
            "id_proyecto": fila[3],
            "nombre_proyecto": fila[4],
        })
    return {"items": items, "total": total}, 200

@api.route("", methods=["POST"])
def agregar_servidor():
    logger.info("Agregar servidor")
    # obtener datos desde la request
    datos: dict = request.get_json()
    if not datos or "nombre" not in datos or "descripcion" not in datos or "id_proyecto" not in datos:
        return {"status": "error", "mensaje": "Debe completar todos los campos"}, 422
    nombre: str = datos.get("nombre", "").strip()
    descripcion: str = datos.get("descripcion", "").strip()
    id_proyecto: int = datos.get("id_proyecto", 0)
    # obtener conexión a la BD
    bd_conexion: Connection = g.bd_conexion
    # validar si el servidor ya existe
    servidor_existente = crud_servidores.obtener_servidor_por_nombre(bd_conexion, nombre)
    if servidor_existente is not None:
        return {"status": "error", "mensaje": "El nombre ya está en uso"}, 422
    # proyecto
    proyecto = crud_proyectos.obtener_proyecto_por_id(bd_conexion, id_proyecto)
    if proyecto is None:
        return {"status": "error", "mensaje": "El proyecto no existe"}, 422
    # insertar en la BD
    id_servidor = crud_servidores.agregar_servidor(bd_conexion, nombre, descripcion, id_proyecto)
    crud_eventos.agregar_evento(
        bd_conexion,
        TIPOS_EVENTO.SERVIDOR_AGREGAR,
        None,
        id_servidor,
        f"Servidor agregado: {nombre}",
        {
            "id_servidor": id_servidor,
            "nombre": nombre,
            "descripcion": descripcion,
            "id_proyecto": id_proyecto,
            "nombre_proyecto": proyecto[1],
        }
    )
    bd_conexion.commit()
    return {"status": "success", "mensaje": "Servidor agregado correctamente"}, 201

@api.route("/<int:id_servidor>", methods=["PUT"])
def modificar_servidor(id_servidor: int):
    logger.info(f"Modificando servidor {id_servidor}")
    # obtener datos desde la request
    datos: dict = request.get_json()
    if not datos or "nombre" not in datos or "descripcion" not in datos or "id_proyecto" not in datos:
        return {"status": "error", "mensaje": "Debe completar todos los campos"}, 422
    nombre: str = datos.get("nombre", "").strip()
    descripcion: str = datos.get("descripcion", "").strip()
    id_proyecto: int = datos.get("id_proyecto", 0)
    # obtener conexión a la BD
    bd_conexion: Connection = g.bd_conexion
    # validar si el servidor ya existe en otro proyecto (que no sea el mismo)
    servidor_existente = crud_servidores.obtener_servidor_por_nombre(bd_conexion, nombre)
    if servidor_existente is not None and servidor_existente[0] != id_servidor:
        return {"status": "error", "mensaje": "El nombre ya está en uso por otro servidor"}, 422
    # proyecto
    proyecto = crud_proyectos.obtener_proyecto_por_id(bd_conexion, id_proyecto)
    if proyecto is None:
        return {"status": "error", "mensaje": "El proyecto no existe"}, 422
    # actualizar servidor en la BD
    crud_servidores.modificar_servidor(bd_conexion, id_servidor, nombre, descripcion, id_proyecto)
    crud_eventos.agregar_evento(
        bd_conexion,
        TIPOS_EVENTO.SERVIDOR_MODIFICAR,
        None,
        id_servidor,
        f"Servidor modificado: {nombre}",
        {
            "id_servidor": id_servidor,
            "datos_anteriores": {
                "nombre": servidor_existente[1],
                "descripcion": servidor_existente[2],
                "id_proyecto": servidor_existente[3],
                "nombre_proyecto": servidor_existente[4],
            },
            "datos_nuevos": {
                "nombre": nombre,
                "descripcion": descripcion,
                "id_proyecto": id_proyecto,
                "nombre_proyecto": proyecto[1],
            }
        }
    )
    bd_conexion.commit()
    return {"status": "success", "mensaje": "Servidor modificado correctamente"}, 200

@api.route("/<int:id_servidor>", methods=["DELETE"])
def deshabilitar_servidor(id_servidor: int):
    logger.info(f"Deshabilitando servidor {id_servidor}")
    # obtener conexión a la BD
    bd_conexion: Connection = g.bd_conexion
    # actualizar estado del servidor
    crud_servidores.actualizar_estado_servidor(bd_conexion, id_servidor, ESTADOS.INACTIVO)
    servidor = crud_servidores.obtener_servidor_por_id(bd_conexion, id_servidor)
    crud_eventos.agregar_evento(
        bd_conexion,
        TIPOS_EVENTO.SERVIDOR_DESHABILITAR,
        None,
        id_servidor,
        f"Servidor deshabilitado: {servidor[1]}",
        {
            "id_servidor": id_servidor,
            "nombre": servidor[1],
            "descripcion": servidor[2],
            "id_proyecto": servidor[3],
            "nombre_proyecto": servidor[4],
        }
    )
    bd_conexion.commit()
    return {"status": "success", "mensaje": "Servidor deshabilitado correctamente"}, 200