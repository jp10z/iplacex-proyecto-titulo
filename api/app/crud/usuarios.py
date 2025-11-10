from oracledb import Connection, NUMBER
from datetime import datetime
from app.common import sql
from app.maestros import ESTADOS

def obtener_usuarios_con_paginacion(bd_conexion: Connection, pagina_index: int, pagina_size: int, texto_busqueda: str):
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
        "u.nombre",
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

def obtener_datos_login_por_correo(bd_conexion: Connection, correo: str):
    cursor = bd_conexion.cursor()
    query = """
        SELECT id_usuario, contrasenia
        FROM usuario
        WHERE correo = :correo
        AND id_estado = :id_estado
    """
    query_vars = {
        "correo": correo,
        "id_estado": ESTADOS.ACTIVO
    }
    cursor.execute(query, query_vars)
    resultado = cursor.fetchone()
    cursor.close()
    return resultado

def obtener_estado_y_rol_usuario(bd_conexion: Connection, id_usuario: int):
    cursor = bd_conexion.cursor()
    query = """
        SELECT u.id_estado, u.id_rol
        FROM usuario u
        WHERE u.id_usuario = :id_usuario
    """
    query_vars = {
        "id_usuario": id_usuario
    }
    cursor.execute(query, query_vars)
    resultado = cursor.fetchone()
    cursor.close()
    return resultado

def obtener_usuario_por_id(bd_conexion: Connection, id_usuario: int):
    cursor = bd_conexion.cursor()
    query = """
        SELECT u.id_usuario, u.correo, u.nombre, r.nombre AS rol
        FROM usuario u
        INNER JOIN rol r
            ON u.id_rol = r.id_rol
        WHERE u.id_usuario = :id_usuario
        AND u.id_estado = :id_estado
    """
    query_vars = {
        "id_usuario": id_usuario,
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
        RETURNING id_usuario INTO :id_usuario
    """
    id_usuario = cursor.var(NUMBER)
    query_vars = {
        "correo": correo,
        "nombre": nombre,
        "contrasenia": hash_contrasenia,
        "id_rol": id_rol,
        "id_estado": ESTADOS.ACTIVO,
        "id_usuario": id_usuario
    }
    cursor.execute(query, query_vars)
    cursor.close()
    return id_usuario.getvalue()[0]

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

def obtener_lista_proyectos_usuario(bd_conexion: Connection, id_usuario: int):
    cursor = bd_conexion.cursor()
    query = """
        SELECT p.id_proyecto, p.nombre
        FROM usuario_proyecto up
        INNER JOIN proyecto p
            ON up.id_proyecto = p.id_proyecto
        WHERE up.id_usuario = :id_usuario
        AND p.id_estado = :id_estado
        AND up.id_estado = :id_estado
        ORDER BY p.nombre ASC
    """
    query_vars = {
        "id_estado": ESTADOS.ACTIVO,
        "id_usuario": id_usuario
    }
    cursor.execute(query, query_vars)
    resultado = cursor.fetchall()
    cursor.close()
    return resultado

def setear_proyectos_usuario(bd_conexion: Connection, id_usuario: int, lista_id_proyectos: list[int]):
    # bindeo de los proyectos (oracle no soporta listas directamente)
    if not lista_id_proyectos:
        lista_id_proyectos = [-1]  # truco en caso de que no se pasen proyectos
    proyectos_vars_sql = ", ".join(f":id_proyecto_{i}" for i in range(len(lista_id_proyectos)))
    cursor = bd_conexion.cursor()
    # deshabilitar todas las asociaciones activas actuales que no estén en la nueva lista
    query_deshabilitar = """
        UPDATE usuario_proyecto
        SET id_estado = :id_estado_inactivo, fecha_actualizacion = :fecha_actualizacion
        WHERE id_usuario = :id_usuario
        AND id_estado = :id_estado_activo
        AND id_proyecto NOT IN ({proyectos_vars_sql})
    """.format(proyectos_vars_sql=proyectos_vars_sql)
    vars_deshabilitar = {
        "fecha_actualizacion": datetime.now(),
        "id_usuario": id_usuario,
        "id_estado_activo": ESTADOS.ACTIVO,
        "id_estado_inactivo": ESTADOS.INACTIVO
    }
    for indice, id_proyecto in enumerate(lista_id_proyectos):
        vars_deshabilitar[f"id_proyecto_{indice}"] = id_proyecto
    cursor.execute(query_deshabilitar, vars_deshabilitar)
    # reactivar en caso de que existan asociaciones deshabilitadas
    query_reactivar = """
        UPDATE usuario_proyecto
        SET id_estado = :id_estado_activo, fecha_actualizacion = :fecha_actualizacion
        WHERE id_usuario = :id_usuario
        AND id_estado = :id_estado_inactivo
        AND id_proyecto IN ({proyectos_vars_sql})
    """.format(proyectos_vars_sql=proyectos_vars_sql)
    vars_reactivar = {
        "fecha_actualizacion": datetime.now(),
        "id_usuario": id_usuario,
        "id_estado_activo": ESTADOS.ACTIVO,
        "id_estado_inactivo": ESTADOS.INACTIVO,
    }
    for indice, id_proyecto in enumerate(lista_id_proyectos):
        vars_reactivar[f"id_proyecto_{indice}"] = id_proyecto
    cursor.execute(query_reactivar, vars_reactivar)
    # insertar nuevas asociaciones que no existan
    query_insertar = """
        INSERT INTO usuario_proyecto (id_usuario, id_proyecto, id_estado)
        SELECT :id_usuario, p.id_proyecto, :id_estado
        FROM proyecto p
        WHERE p.id_proyecto IN ({proyectos_vars_sql})
        AND p.id_proyecto NOT IN (
            SELECT up.id_proyecto
            FROM usuario_proyecto up
            WHERE up.id_usuario = :id_usuario
        )
    """.format(proyectos_vars_sql=proyectos_vars_sql)
    vars_insertar = {
        "id_usuario": id_usuario,
        "id_estado": ESTADOS.ACTIVO,
    }
    for indice, id_proyecto in enumerate(lista_id_proyectos):
        vars_insertar[f"id_proyecto_{indice}"] = id_proyecto
    cursor.execute(query_insertar, vars_insertar)
    cursor.close()