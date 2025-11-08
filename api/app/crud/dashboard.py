from oracledb import Connection
from app.maestros import ESTADOS

def obtener_estados_servidores(bd_conexion: Connection, id_proyecto: int):
    cursor = bd_conexion.cursor()
    query = """
        SELECT s.id_servidor, s.nombre, p.nombre AS nombre_proyecto, sa.fecha_acceso, sa.duracion_minutos
        FROM servidor s
        LEFT JOIN proyecto p
            ON s.id_proyecto = p.id_proyecto
        LEFT JOIN servidor_acceso sa
            ON s.id_servidor = sa.id_servidor
        WHERE s.id_estado = :id_estado
        AND s.id_proyecto = :id_proyecto
        ORDER BY s.nombre ASC
    """
    query_vars = {
        "id_estado": ESTADOS.ACTIVO,
        "id_proyecto": id_proyecto
    }
    cursor.execute(query, query_vars)
    resultado_items = cursor.fetchall()
    cursor.close()
    return resultado_items