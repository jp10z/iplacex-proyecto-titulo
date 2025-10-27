from oracledb import Connection
from datetime import datetime
from app.common import sql
from app.maestros import ESTADOS

def obtener_usuarios_con_paginacion(bd_conexion: Connection, pagina_index: int, pagina_size: int, ordenar_columna: str, ordenar_direccion: str, texto_busqueda: str):
    cursor = bd_conexion.cursor()
    query_base = """
        SELECT {columnas}
        FROM usuario u
        INNER JOIN rol r
            ON u.id_rol = r.id_rol
        WHERE u.id_estado = :id_estado
        AND (
            u.correo COLLATE BINARY_AI LIKE '%' || :texto_busqueda || '%'
            OR u.nombre COLLATE BINARY_AI LIKE '%' || :texto_busqueda || '%'
        )
    """
    # obtener los usuarios con paginación
    query_con_paginacion = sql.obtener_query_paginacion(
        query_base.replace("{columnas}", "u.id_usuario, u.correo, u.nombre, r.nombre AS rol"),
        ordenar_columna,
        ordenar_direccion,
        pagina_index,
        pagina_size,
        {"id_usuario": "u.id_usuario", "correo": "u.correo", "nombre": "u.nombre"}
    )
    query_vars = {
        "id_estado": ESTADOS.ACTIVO,
        "texto_busqueda": texto_busqueda
    }
    cursor.execute(query_con_paginacion, query_vars)
    resultado_items = cursor.fetchall()
    # obtener el total según los filtros
    query_total = query_base.replace("{columnas}", "COUNT(*)")
    cursor.execute(query_total, query_vars)
    resultado_total = cursor.fetchone()[0]
    cursor.close()
    return resultado_items, resultado_total

def obtener_usuario_por_correo(bd_conexion: Connection, correo: str):
    cursor = bd_conexion.cursor()
    query = """
        SELECT u.id_usuario, u.correo, u.nombre, r.nombre AS rol
        FROM usuario u
        INNER JOIN rol r
            ON u.id_rol = r.id_rol
        WHERE u.correo = :correo
        AND u.id_estado = :id_estado
    """
    query_vars = {
        "correo": correo,
        "id_estado": ESTADOS.ACTIVO
    }
    cursor.execute(query, query_vars)
    resultado = cursor.fetchone()
    cursor.close()
    return resultado

def agregar_usuario(bd_conexion: Connection, correo: str, nombre: str, hash_contrasenia: str, id_rol: int):
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
    cursor.close()

def modificar_usuario(bd_conexion: Connection, id_usuario: int, correo: str, nombre: str, id_rol: int, contrasenia: str | None = None):
    cursor = bd_conexion.cursor()
    if contrasenia:
        query = """
            UPDATE usuario
            SET correo = :correo, nombre = :nombre, id_rol = :id_rol, contrasenia = :contrasenia, fecha_actualizacion = :fecha_actualizacion
            WHERE id_usuario = :id_usuario
        """
        query_vars = {
            "correo": correo,
            "nombre": nombre,
            "id_rol": id_rol,
            "contrasenia": contrasenia,
            "fecha_actualizacion": datetime.now(),
            "id_usuario": id_usuario,
        }
    else:
        query = """
            UPDATE usuario
            SET correo = :correo, nombre = :nombre, id_rol = :id_rol, fecha_actualizacion = :fecha_actualizacion
            WHERE id_usuario = :id_usuario
        """
        query_vars = {
            "correo": correo,
            "nombre": nombre,
            "id_rol": id_rol,
            "fecha_actualizacion": datetime.now(),
            "id_usuario": id_usuario
        }
    cursor.execute(query, query_vars)
    cursor.close()

def actualizar_estado_usuario(bd_conexion: Connection, id_usuario: int, id_estado: int):
    cursor = bd_conexion.cursor()
    query = """
        UPDATE usuario
        SET id_estado = :id_estado, fecha_actualizacion = :fecha_actualizacion
        WHERE id_usuario = :id_usuario
    """
    query_vars = {
        "id_estado": id_estado,
        "fecha_actualizacion": datetime.now(),
        "id_usuario": id_usuario
    }
    cursor.execute(query, query_vars)
    cursor.close()