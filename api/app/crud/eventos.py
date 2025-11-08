import logging, json
from datetime import datetime
from oracledb import Connection
from app.common import sql

logger = logging.getLogger(__name__)

def obtener_eventos_con_paginacion(bd_conexion: Connection, pagina_index: int, pagina_size: int, texto_busqueda: str, id_tipo_evento: int | None, id_usuario: int | None, id_servidor: int | None, fecha_desde: str, fecha_hasta: str):
    cursor = bd_conexion.cursor()
    query_base = """
        SELECT {columnas}
        FROM evento e
        INNER JOIN tipo_evento te
            ON e.id_tipo_evento = te.id_tipo_evento
        LEFT JOIN usuario u
            ON e.id_usuario = u.id_usuario
        LEFT JOIN servidor s
            ON e.id_servidor = s.id_servidor
        WHERE (:id_tipo_evento IS NULL OR e.id_tipo_evento = :id_tipo_evento)
        AND (:id_usuario IS NULL OR e.id_usuario = :id_usuario)
        AND (:id_servidor IS NULL OR e.id_servidor = :id_servidor)
        AND e.fecha_creacion >= TO_DATE(:fecha_desde, 'YYYY-MM-DD')
        AND e.fecha_creacion < TO_DATE(:fecha_hasta, 'YYYY-MM-DD') + 1
        AND e.detalle COLLATE BINARY_AI LIKE '%' || :texto_busqueda || '%'
    """
    # obtener los servidores con paginación
    query_con_paginacion = sql.obtener_query_paginacion(
        query_base.replace("{columnas}", "e.id_evento, te.nombre AS nombre_tipo_evento, e.detalle, e.fecha_creacion, u.nombre AS nombre_usuario, s.nombre AS nombre_servidor"),
        "e.fecha_creacion",
        "ASC",
        pagina_index,
        pagina_size
    )
    query_vars = {
        "id_tipo_evento": id_tipo_evento,
        "id_usuario": id_usuario,
        "id_servidor": id_servidor,
        "fecha_desde": fecha_desde,
        "fecha_hasta": fecha_hasta,
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

def obtener_datos_evento(bd_conexion: Connection, id_evento: int):
    cursor = bd_conexion.cursor()
    query = """
        SELECT e.id_evento, te.nombre AS nombre_tipo_evento, e.detalle, e.fecha_creacion, u.nombre AS nombre_usuario, s.nombre AS nombre_servidor, e.datos
        FROM evento e
        INNER JOIN tipo_evento te
            ON e.id_tipo_evento = te.id_tipo_evento
        LEFT JOIN usuario u
            ON e.id_usuario = u.id_usuario
        LEFT JOIN servidor s
            ON e.id_servidor = s.id_servidor
        WHERE e.id_evento = :id_evento
    """
    query_vars = {
        "id_evento": id_evento
    }
    cursor.execute(query, query_vars)
    resultado = cursor.fetchone()
    cursor.close()
    return resultado

def agregar_evento(bd_conexion: Connection, id_tipo_evento: int, id_usuario: int | None, id_servidor: int | None, detalle: str, datos: dict | None = None):
    cursor = bd_conexion.cursor()
    query = """
        INSERT INTO evento (id_tipo_evento, id_usuario, id_servidor, detalle, datos)
        VALUES (:id_tipo_evento, :id_usuario, :id_servidor, :detalle, :datos)
    """
    query_vars = {
        "id_tipo_evento": id_tipo_evento,
        "id_usuario": 1, # id usuario en duro por ahora
        "id_servidor": id_servidor,
        "detalle": detalle,
        "datos": json.dumps(datos) if datos else None
    }
    cursor.execute(query, query_vars)
    cursor.close()