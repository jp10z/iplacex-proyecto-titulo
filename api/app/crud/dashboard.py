from oracledb import Connection
from app.maestros import ESTADOS
from datetime import datetime

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

def agregar_acceso(bd_conexion: Connection, id_servidor: int, id_usuario: int, duracion_minutos: int, notas: str):
    cursor = bd_conexion.cursor()
    # obtener servidor_acceso del servidor
    query = """
        SELECT id_servidor_acceso
        FROM servidor_acceso
        WHERE id_servidor = :id_servidor
    """
    query_vars = {
        "id_servidor": id_servidor
    }
    cursor.execute(query, query_vars)
    resultado = cursor.fetchone()
    if resultado is None:
        # insertar servidor_acceso
        query_insert = """
            INSERT INTO servidor_acceso (id_servidor, id_usuario, fecha_acceso, duracion_minutos, notas, id_estado)
            VALUES (:id_servidor, :id_usuario, :fecha_acceso, :duracion_minutos, :notas, :id_estado)
        """
        query_vars_insert = {
            "id_servidor": id_servidor,
            "id_usuario": id_usuario,
            "fecha_acceso": datetime.now(),
            "duracion_minutos": duracion_minutos,
            "notas": notas,
            "id_estado": ESTADOS.ACTIVO
        }
        cursor.execute(query_insert, query_vars_insert)
    else:
        # actualizar servidor_acceso
        query_update = """
            UPDATE servidor_acceso
            SET id_usuario = :id_usuario,
                fecha_acceso = :fecha_acceso,
                duracion_minutos = :duracion_minutos,
                notas = :notas,
                fecha_actualizacion = :fecha_actualizacion
            WHERE id_servidor_acceso = :id_servidor_acceso
        """
        query_vars_update = {
            "id_usuario": id_usuario,
            "fecha_acceso": datetime.now(),
            "duracion_minutos": duracion_minutos,
            "notas": notas,
            "fecha_actualizacion": datetime.now(),
            "id_servidor_acceso": resultado[0]
        }
        cursor.execute(query_update, query_vars_update)