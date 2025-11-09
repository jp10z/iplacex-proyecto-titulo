import logging
from flask import Blueprint, g, request
from oracledb import Connection
from app.common import contrasenias
from app.maestros import ESTADOS, ROLES, TIPOS_EVENTO
from app.crud import usuarios as crud_usuarios
from app.crud import eventos as crud_eventos

api = Blueprint("usuarios", __name__, url_prefix="/api/usuarios")

logger = logging.getLogger(__name__)

@api.route("", methods=["GET"])
def obtener_usuarios():
    logger.info("Obteniendo usuarios desde la BD")
    # obtener parametros desde la request
    texto_busqueda = request.args.get("buscar", "").strip()
    pagina_index = int(request.args.get("paginaIndex", "1"))
    pagina_size = int(request.args.get("paginaSize", "10"))
    logger.debug(f"Buscando usuarios con texto: '{texto_busqueda}'")
    # Obtener usuarios desde la BD
    usuarios, total = crud_usuarios.obtener_usuarios_con_paginacion(
        g.bd_conexion,
        pagina_index,
        pagina_size,
        texto_busqueda
    )
    # Formatear resultados
    items = []
    for fila in usuarios:
        items.append({
            "id": fila[0],
            "correo": fila[1],
            "nombre": fila[2],
            "rol": fila[3],
        })
    return {"items": items, "total": total}, 200

@api.route("", methods=["POST"])
def agregar_usuario():
    logger.info("Agregar usuario")
    # obtener datos desde la request
    datos: dict = request.get_json()
    if not datos or "correo" not in datos or "nombre" not in datos or "contrasenia" not in datos or "rol" not in datos:
        return {"status": "error", "mensaje": "Debe completar todos los campos"}, 422
    correo: str = datos.get("correo", "").strip()
    nombre: str = datos.get("nombre", "").strip()
    contrasenia: str = datos.get("contrasenia", "").strip()
    # Se encripta la clave
    hash_contrasenia = contrasenias.generar_hash_contrasenia(contrasenia)
    rol: str = datos.get("rol", "").strip()
    if rol == "ADMIN":
        id_rol = ROLES.ADMIN
    elif rol == "OPERADOR":
        id_rol = ROLES.OPERADOR
    else:
        return {"status": "error", "mensaje": "Rol no válido"}, 422
    # obtener conexión a la BD
    bd_conexion: Connection = g.bd_conexion
    # validar si el correo ya existe
    usuario_existente = crud_usuarios.obtener_usuario_por_correo(bd_conexion, correo)
    if usuario_existente is not None:
        return {"status": "error", "mensaje": "El correo ya está en uso"}, 422
    # insertar en la BD
    id_usuario = crud_usuarios.agregar_usuario(bd_conexion, correo, nombre, hash_contrasenia, id_rol)
    crud_eventos.agregar_evento(
        bd_conexion,
        TIPOS_EVENTO.USUARIO_AGREGAR,
        None,
        None,
        f"Usuario agregado: {nombre}",
        {
            "id_usuario": id_usuario,
            "correo": correo,
            "nombre": nombre,
            "rol": rol
        }
    )
    bd_conexion.commit()
    return {"status": "success", "mensaje": "Usuario agregado correctamente"}, 201

@api.route("/<int:id_usuario>", methods=["PUT"])
def modificar_usuario(id_usuario: int):
    logger.info(f"Modificando usuario {id_usuario}")
    # obtener datos desde la request
    datos: dict = request.get_json()
    if not datos or "correo" not in datos or "nombre" not in datos or "rol" not in datos:
        return {"status": "error", "mensaje": "Debe completar todos los campos"}, 422
    correo: str = datos.get("correo", "").strip()
    nombre: str = datos.get("nombre", "").strip()
    contrasenia: str | None = datos.get("contrasenia", None)
    # Se encripta la clave
    hash_contrasenia = contrasenias.generar_hash_contrasenia(contrasenia) if contrasenia else None
    rol: str = datos.get("rol", "").strip()
    if rol == "ADMIN":
        id_rol = ROLES.ADMIN
    elif rol == "OPERADOR":
        id_rol = ROLES.OPERADOR
    else:
        return {"status": "error", "mensaje": "Rol no válido"}, 422
    # obtener conexión a la BD
    bd_conexion: Connection = g.bd_conexion
    # validar si el correo ya existe en otro usuario (que no sea el mismo)
    usuario_existente = crud_usuarios.obtener_usuario_por_correo(bd_conexion, correo)
    if usuario_existente is not None and usuario_existente[0] != id_usuario:
        return {"status": "error", "mensaje": "El correo ya está en uso"}, 422
    # actualizar usuario en la BD
    crud_usuarios.modificar_usuario(bd_conexion, id_usuario, correo, nombre, id_rol, hash_contrasenia)
    crud_eventos.agregar_evento(
        bd_conexion,
        TIPOS_EVENTO.USUARIO_MODIFICAR,
        None,
        None,
        f"Usuario modificado: {nombre}",
        {
            "id_usuario": id_usuario,
            "contraseña_modificada": contrasenia is not None,
            "datos_anteriores": {
                "correo": usuario_existente[1],
                "nombre": usuario_existente[2],
                "rol": usuario_existente[3],
            },
            "datos_nuevos": {
                "correo": correo,
                "nombre": nombre,
                "rol": rol
            }
        }
    )
    bd_conexion.commit()
    return {"status": "success", "mensaje": "Usuario modificado correctamente"}, 200

@api.route("/<int:id_usuario>", methods=["DELETE"])
def deshabilitar_usuario(id_usuario: int):
    logger.info(f"Deshabilitando usuario {id_usuario}")
    # obtener conexión a la BD
    bd_conexion: Connection = g.bd_conexion
    # obtener datos del usuario antes de deshabilitar
    usuario = crud_usuarios.obtener_usuario_por_id(bd_conexion, id_usuario)
    # actualizar estado del usuario
    crud_usuarios.actualizar_estado_usuario(bd_conexion, id_usuario, ESTADOS.INACTIVO)
    crud_eventos.agregar_evento(
        bd_conexion,
        TIPOS_EVENTO.USUARIO_DESHABILITAR,
        None,
        None,
        f"Usuario deshabilitado: {usuario[2]}",
        {
            "id_usuario": id_usuario,
            "correo": usuario[1],
            "nombre": usuario[2],
            "rol": usuario[3]
        }
    )
    bd_conexion.commit()
    return {"status": "success", "mensaje": "Usuario deshabilitado correctamente"}, 200