import logging
from flask import Blueprint, g, jsonify, request
from oracledb import Connection
from app.crud import usuarios as crud_usuarios
from app.common import contrasenias
from app.crud import eventos as crud_eventos
from app.maestros import TIPOS_EVENTO, ROLES
from app import sesion

api = Blueprint("auth", __name__, url_prefix="/api/auth")

logger = logging.getLogger(__name__)

@api.route("/login", methods=["POST"])
def login_usuario():
    logger.info("Intento de login de usuario")
    # obtener datos desde la request
    datos: dict = request.get_json()
    if not datos or "correo" not in datos or "contrasenia" not in datos:
        return {"status": "error", "mensaje": "Debe completar todos los campos"}, 422
    correo: str = datos.get("correo", "").strip()
    contrasenia: str = datos.get("contrasenia", "").strip()
    # validar usuario y contrasenia
    bd_conexion: Connection = g.bd_conexion
    datos_login = crud_usuarios.obtener_datos_login_por_correo(bd_conexion, correo)
    if datos_login is None:
        logger.warning(f"Intento de login fallido para el correo (correo no existe): {correo}")
        crud_eventos.agregar_evento(
            bd_conexion,
            TIPOS_EVENTO.LOGIN_FALLIDO,
            None,
            None,
            f"Intento fallido de login para el correo: {correo}",
            {
                "correo": correo,
                "motivo": "correo no existe"
            }
        )
        bd_conexion.commit()
        return {"status": "error", "mensaje": "Correo o contraseña incorrectos"}, 401
    if not datos_login[1].startswith("scrypt:") and contrasenia == datos_login[1]:
        logger.warning(f"Ingresando con contraseña no encriptada para el correo: {correo}") 
    elif not contrasenias.verificar_contrasenia(contrasenia, datos_login[1]):
        logger.warning(f"Intento de login fallido para el correo (contraseña incorrecta): {correo}")
        crud_eventos.agregar_evento(
            bd_conexion,
            TIPOS_EVENTO.LOGIN_FALLIDO,
            datos_login[0],
            None,
            f"Intento fallido de login para el correo: {correo}",
            {
                "id_usuario": datos_login[0],
                "correo": correo,
                "motivo": "contraseña incorrecta"            }
        )
        bd_conexion.commit()
        return {"status": "error", "mensaje": "Correo o contraseña incorrectos"}, 401
    # session
    sesion_token = sesion.crear_token(datos_login[0])
    response = jsonify({"status": "success"})
    response = sesion.guardar_cookie_token(response, sesion_token)
    # registrar evento de login
    crud_eventos.agregar_evento(
        bd_conexion,
        TIPOS_EVENTO.LOGIN,
        datos_login[0],
        None,
        f"Usuario {correo} ha iniciado sesión",
        {
            "id_usuario": datos_login[0],
            "correo": correo        }
    )
    bd_conexion.commit()
    return response, 200

@api.route("/datos", methods=["GET"])
@sesion.ruta_protegida([ROLES.ADMIN, ROLES.OPERADOR])
def obtener_datos_sesion():
    id_usuario = g.id_usuario
    id_rol = g.id_rol
    usuario = crud_usuarios.obtener_usuario_por_id(g.bd_conexion, id_usuario)
    return {
        "id_usuario": id_usuario,
        "correo_usuario": usuario[1],
        "nombre_usuario": usuario[2],
        "id_rol": id_rol,
        "nombre_rol": usuario[3]
    }, 200

@api.route("/logout", methods=["POST"])
@sesion.ruta_protegida([ROLES.ADMIN, ROLES.OPERADOR])
def logout_usuario():
    id_usuario = g.id_usuario
    usuario = crud_usuarios.obtener_usuario_por_id(g.bd_conexion, id_usuario)
    logger.info(f"Usuario {usuario[1]} ha cerrado sesión")
    response = jsonify({"status": "success"})
    response.set_cookie("token", "", expires=0, path="/")
    return response, 200