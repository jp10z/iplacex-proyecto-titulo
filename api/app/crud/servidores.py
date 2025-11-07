from oracledb import Connection
from datetime import datetime
from app.common import sql
from app.maestros import ESTADOS

def obtener_servidores_con_paginacion(bd_conexion: Connection, pagina_index: int, pagina_size: int, texto_busqueda: str, id_proyecto: int | None):
    cursor = bd_conexion.cursor()
    query_base = """
        SELECT {columnas}
        FROM servidor s
        LEFT JOIN proyecto p
            ON p.id_proyecto = s.id_proyecto
        WHERE s.id_estado = :id_estado
        AND s.id_proyecto = NVL(:id_proyecto, s.id_proyecto)
        AND (
            s.nombre COLLATE BINARY_AI LIKE '%' || :texto_busqueda || '%'
            OR s.descripcion COLLATE BINARY_AI LIKE '%' || :texto_busqueda || '%'
        )
    """
    # obtener los servidores con paginación
    query_con_paginacion = sql.obtener_query_paginacion(
        query_base.replace("{columnas}", "s.id_servidor, s.nombre, s.descripcion, p.id_proyecto AS id_proyecto, p.nombre AS nombre_proyecto"),
        "s.nombre",
        "ASC",
        pagina_index,
        pagina_size
    )
    query_vars = {
        "id_estado": ESTADOS.ACTIVO,
        "texto_busqueda": texto_busqueda,
        "id_proyecto": id_proyecto
    }
    cursor.execute(query_con_paginacion, query_vars)
    resultado_items = cursor.fetchall()
    # obtener el total según los filtros
    query_total = sql.obtener_query_total(query_base)
    cursor.execute(query_total, query_vars)
    resultado = cursor.fetchone()
    resultado_total = resultado[0] if resultado is not None else 0
    cursor.close()
    return resultado_items, resultado_total

def obtener_servidor_por_nombre(bd_conexion: Connection, nombre: str):
    cursor = bd_conexion.cursor()
    query = """
        SELECT s.id_servidor, s.nombre, s.descripcion
        FROM servidor s
        WHERE s.nombre = :nombre
        AND s.id_estado = :id_estado
    """
    query_vars = {
        "nombre": nombre,
        "id_estado": ESTADOS.ACTIVO
    }
    cursor.execute(query, query_vars)
    resultado = cursor.fetchone()
    cursor.close()
    return resultado

def agregar_servidor(bd_conexion: Connection, nombre: str, descripcion: str, id_proyecto: int):
    cursor = bd_conexion.cursor()
    query = """
        INSERT INTO servidor (nombre, descripcion, id_proyecto, id_estado)
        VALUES (:nombre, :descripcion, :id_proyecto, :id_estado)
    """
    query_vars = {
        "nombre": nombre,
        "descripcion": descripcion,
        "id_proyecto": id_proyecto,
        "id_estado": ESTADOS.ACTIVO
    }
    cursor.execute(query, query_vars)
    cursor.close()

def modificar_servidor(bd_conexion: Connection, id_servidor: int, nombre: str, descripcion: str, id_proyecto: int):
    cursor = bd_conexion.cursor()
    query = """
        UPDATE servidor
        SET nombre = :nombre, descripcion = :descripcion, id_proyecto = :id_proyecto, fecha_actualizacion = :fecha_actualizacion
        WHERE id_servidor = :id_servidor
    """
    query_vars = {
        "nombre": nombre,
        "descripcion": descripcion,
        "id_proyecto": id_proyecto,
        "fecha_actualizacion": datetime.now(),
        "id_servidor": id_servidor
    }
    cursor.execute(query, query_vars)
    cursor.close()

def actualizar_estado_servidor(bd_conexion: Connection, id_servidor: int, id_estado: int):
    cursor = bd_conexion.cursor()
    query = """
        UPDATE servidor
        SET id_estado = :id_estado, fecha_actualizacion = :fecha_actualizacion
        WHERE id_servidor = :id_servidor
    """
    query_vars = {
        "id_estado": id_estado,
        "fecha_actualizacion": datetime.now(),
        "id_servidor": id_servidor
    }
    cursor.execute(query, query_vars)
    cursor.close()