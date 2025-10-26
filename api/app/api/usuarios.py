import logging
from flask import Blueprint, g, request
from oracledb import Connection
from app.common import contrasenias
from app.maestros import ESTADOS, ROLES

api = Blueprint("usuarios", __name__, url_prefix="/api/usuarios")

logger = logging.getLogger(__name__)

@api.route("", methods=["GET"])
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

@api.route("", methods=["POST"])
def agregar_usuario():
    logger.info("Agregar usuario")
    # obtener datos desde la request
    datos = request.get_json()
    if not datos or "correo" not in datos or "nombre" not in datos or "contrasenia" not in datos or "rol" not in datos:
        return {"status": "error", "mensaje": "Debe completar todos los campos"}, 422
    correo: str = datos["correo"].strip()
    nombre: str = datos["nombre"].strip()
    contrasenia: str = datos["contrasenia"].strip()
    # Se encripta la clave
    hash_contrasenia = contrasenias.generar_hash_contrasenia(contrasenia)
    rol: str = datos["rol"].strip()
    if rol == "ADMIN":
        id_rol = ROLES.ADMIN
    elif rol == "OPERADOR":
        id_rol = ROLES.OPERADOR
    else:
        return {"status": "error", "mensaje": "Rol no válido"}, 422
    # obtener conexión a la BD
    bd_conexion: Connection = g.bd_conexion
    # validar si el correo ya existe
    cursor = bd_conexion.cursor()
    query = "SELECT COUNT(*) FROM usuario WHERE correo = :correo"
    query_vars = {
        "correo": datos["correo"]
    }
    cursor.execute(query, query_vars)
    existe = cursor.fetchone()[0] > 0
    cursor.close()
    if existe:
        return {"status": "error", "mensaje": "El correo ya está en uso"}, 422
    # insertar en la BD
    cursor = bd_conexion.cursor()
    query = """
        INSERT INTO usuario (correo, nombre, contrasenia, id_rol, id_estado)
        VALUES (:correo, :nombre, :contrasenia, :id_rol, :id_estado)
    """
    query_vars = {
        "correo": correo,
        "nombre": nombre,
        "contrasenia": hash_contrasenia,
        "id_rol": id_rol,
        "id_estado": ESTADOS.ACTIVO
    }
    cursor.execute(query, query_vars)
    bd_conexion.commit()
    cursor.close()
    return {"status": "success", "mensaje": "Usuario agregado correctamente"}, 201

@api.route("/<int:id_usuario>", methods=["DELETE"])
def deshabilitar_usuario(id_usuario: int):
    logger.info(f"Deshabilitando usuario {id_usuario}")
    # obtener conexión a la BD
    bd_conexion: Connection = g.bd_conexion
    # actualizar estado del usuario
    cursor = bd_conexion.cursor()
    query = """
        UPDATE usuario
        SET id_estado = :id_estado
        WHERE id_usuario = :id_usuario
    """
    query_vars = {
        "id_estado": ESTADOS.INACTIVO,
        "id_usuario": id_usuario
    }
    cursor.execute(query, query_vars)
    bd_conexion.commit()
    cursor.close()
    return {"status": "success", "mensaje": "Usuario deshabilitado correctamente"}, 200