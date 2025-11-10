import logging, jwt
from datetime import datetime, timedelta
from flask import request, jsonify, current_app, g, make_response, Response
from app.crud import usuarios as crud_usuarios
from app.maestros import ESTADOS

logger = logging.getLogger(__name__)

ACCESS_TOKEN_DURACION_MINUTOS = 15 # 15 minutis
EXPIRACION_LIMITE_MINUTOS = 120 # 2 horas

def crear_token(id_usuario: int):
    now = datetime.now()
    expiracion = now + timedelta(minutes=ACCESS_TOKEN_DURACION_MINUTOS)
    expiracion_limite = now + timedelta(minutes=EXPIRACION_LIMITE_MINUTOS)
    payload = {
        "id_usuario": id_usuario,
        "expiracion": int(expiracion.timestamp()),
        "expiracion_limite": int(expiracion_limite.timestamp())
    }
    return jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")

def guardar_cookie_token(response: Response, token: str):
    # RECORDAR CONFIGURAR BIEN ESTO CUANDO HAGA DEOPLOY
    response.set_cookie(
        "token",
        token,
        httponly=True,
        secure=False,
        samesite="Lax",
        path="/",
    )
    return response

def decodificar_token(token: str):
    try:
        data = jwt.decode(token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
        return data
    except jwt.ExpiredSignatureError:
        logger.warning("Token expirado")
        return None
    except jwt.InvalidTokenError:
        logger.warning("Token inválido")
        return None

def obtener_datos_sesion():
    # obtener datos del token
    token = request.cookies.get("token")
    if not token:
        logger.warning("No se encontró token en cookies")
        return None, None, None
    data = decodificar_token(token)
    if data is None:
        logger.warning("Token inválido")
        return None, None, None
    # verificar expiración límite
    now = datetime.now()
    expiracion_limite = datetime.fromtimestamp(data["expiracion_limite"])
    logger.debug(f"Expiración límite del token: {expiracion_limite}, ahora: {now}")
    if now > expiracion_limite:
        logger.info("Expiración limite del token alcanzada")
        return None, None, None
    # verificar si se debe refrescar el token
    refresco = None
    expiracion = datetime.fromtimestamp(data["expiracion"])
    if now > expiracion - timedelta(minutes=5): # refrescar si quedan menos de 5 minutos
        nuevo_token = crear_token(data["id_usuario"])
        refresco = make_response()
        guardar_cookie_token(refresco, nuevo_token)
    # obtener rol y estado del usuario
    bd_conexion = g.bd_conexion
    estado_rol = crud_usuarios.obtener_estado_y_rol_usuario(bd_conexion, data["id_usuario"])
    if estado_rol is None or estado_rol[0] != ESTADOS.ACTIVO: # activo
        logger.warning("Usuario inactivo o no encontrado")
        return None, None, None
    return data["id_usuario"], estado_rol[1], refresco

def ruta_protegida(roles: list):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            id_usuario, id_rol, refresco = obtener_datos_sesion()
            if not id_usuario:
                # borrar cookie
                response = make_response(jsonify({"error": "No autenticado"}), 401)
                response.set_cookie("token", "", expires=0, path="/")
                return response, 401
            if id_rol not in roles:
                logger.warning(f"Usuario {id_usuario} con rol {id_rol} no autorizado para esta ruta")
                response = make_response(jsonify({"error": "No autorizado"}), 403)
                return response, 403
            g.id_usuario = id_usuario
            g.id_rol = id_rol
            respuesta_original = fn(*args, **kwargs)
            respuesta = make_response(respuesta_original)
            # Si el token fue refrescado, agregar cookie nueva
            if refresco is not None:
                for header, value in refresco.headers:
                    if header.lower() == "set-cookie":
                        respuesta.headers.add(header, value)
            return respuesta
        wrapper.__name__ = fn.__name__
        return wrapper
    return decorator
