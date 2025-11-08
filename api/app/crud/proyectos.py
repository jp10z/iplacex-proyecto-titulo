from oracledb import Connection, NUMBER
from datetime import datetime
from app.common import sql
from app.maestros import ESTADOS

def obtener_proyectos_con_paginacion(bd_conexion: Connection, pagina_index: int, pagina_size: int, texto_busqueda: str):
    cursor = bd_conexion.cursor()
    query_base = """
        SELECT {columnas}
        FROM proyecto p
        LEFT JOIN servidor s
            ON p.id_proyecto = s.id_proyecto
        WHERE p.id_estado = :id_estado
        AND (
            p.nombre COLLATE BINARY_AI LIKE '%' || :texto_busqueda || '%'
            OR p.descripcion COLLATE BINARY_AI LIKE '%' || :texto_busqueda || '%'
        )
        GROUP BY p.id_proyecto, p.nombre, p.descripcion
    """
    # obtener los proyectos con paginación
    query_con_paginacion = sql.obtener_query_paginacion(
        query_base.replace("{columnas}", "p.id_proyecto, p.nombre, p.descripcion, COUNT(s.id_servidor) AS servidores"),
        "p.nombre",
        "ASC",
        pagina_index,
        pagina_size
    )
    query_vars = {
        "id_estado": ESTADOS.ACTIVO,
        "texto_busqueda": texto_busqueda
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

def obtener_proyecto_por_nombre(bd_conexion: Connection, nombre: str):
    cursor = bd_conexion.cursor()
    query = """
        SELECT p.id_proyecto, p.nombre, p.descripcion
        FROM proyecto p
        WHERE p.nombre = :nombre
        AND p.id_estado = :id_estado
    """
    query_vars = {
        "nombre": nombre,
        "id_estado": ESTADOS.ACTIVO
    }
    cursor.execute(query, query_vars)
    resultado = cursor.fetchone()
    cursor.close()
    return resultado

def obtener_proyecto_por_id(bd_conexion: Connection, id_proyecto: int):
    cursor = bd_conexion.cursor()
    query = """
        SELECT p.id_proyecto, p.nombre, p.descripcion
        FROM proyecto p
        WHERE p.id_proyecto = :id_proyecto
        AND p.id_estado = :id_estado
    """
    query_vars = {
        "id_proyecto": id_proyecto,
        "id_estado": ESTADOS.ACTIVO
    }
    cursor.execute(query, query_vars)
    resultado = cursor.fetchone()
    cursor.close()
    return resultado

def agregar_proyecto(bd_conexion: Connection, nombre: str, descripcion: str):
    cursor = bd_conexion.cursor()
    query = """
        INSERT INTO proyecto (nombre, descripcion, id_estado)
        VALUES (:nombre, :descripcion, :id_estado)
        RETURNING id_proyecto INTO :id_proyecto
    """
    id_proyecto = cursor.var(NUMBER)
    query_vars = {
        "nombre": nombre,
        "descripcion": descripcion,
        "id_estado": ESTADOS.ACTIVO,
        "id_proyecto": id_proyecto
    }
    cursor.execute(query, query_vars)
    cursor.close()
    return id_proyecto.getvalue()[0]

def modificar_proyecto(bd_conexion: Connection, id_proyecto: int, nombre: str, descripcion: str):
    cursor = bd_conexion.cursor()
    query = """
        UPDATE proyecto
        SET nombre = :nombre, descripcion = :descripcion, fecha_actualizacion = :fecha_actualizacion
        WHERE id_proyecto = :id_proyecto
    """
    query_vars = {
        "id_proyecto": id_proyecto,
        "nombre": nombre,
        "descripcion": descripcion,
        "fecha_actualizacion": datetime.now()
    }
    cursor.execute(query, query_vars)
    cursor.close()

def actualizar_estado_proyecto(bd_conexion: Connection, id_proyecto: int, id_estado: int):
    cursor = bd_conexion.cursor()
    query = """
        UPDATE proyecto
        SET id_estado = :id_estado, fecha_actualizacion = :fecha_actualizacion
        WHERE id_proyecto = :id_proyecto
    """
    query_vars = {
        "id_estado": id_estado,
        "fecha_actualizacion": datetime.now(),
        "id_proyecto": id_proyecto
    }
    cursor.execute(query, query_vars)
    cursor.close()

def obtener_lista_proyectos(bd_conexion: Connection):
    cursor = bd_conexion.cursor()
    query = """
        SELECT p.id_proyecto, p.nombre
        FROM proyecto p
        WHERE p.id_estado = :id_estado
        ORDER BY p.nombre ASC
    """
    query_vars = {
        "id_estado": ESTADOS.ACTIVO
    }
    cursor.execute(query, query_vars)
    resultado = cursor.fetchall()
    cursor.close()
    return resultado