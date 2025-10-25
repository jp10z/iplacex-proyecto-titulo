import logging, os
import oracledb

logger = logging.getLogger(__name__)

def inicializar_bd():
    # inicializar el pool de conexiones a la base de datos Oracle
    user, password, connection_string = get_credenciales()
    try:
        bd_pool = oracledb.create_pool(
            user=user,
            password=password,
            dsn=connection_string,
        )
        logger.info("Pool de conexiones a la BD iniciado, probando conexión...")
        with bd_pool.acquire() as connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1 FROM DUAL")
                result = cursor.fetchone()
                if result:
                    logger.info(f"Conexión exitosa: {result[0]}")
        return bd_pool
    except Exception as ex:
        logger.error(f"Error al inicializar el pool de conexiones a la base de datos: {ex}")
        raise ex

def get_credenciales():
    # obtener credenciales desde las variables de entorno
    user = os.getenv("BD_USER")
    password = os.getenv("BD_PASSWORD")
    connection_string = os.getenv("BD_CONNECTION_STRING")
    # validar si se pudo obtener las credenciales y retornarlas
    if not all([user, password, connection_string]):
        raise ValueError("Debe configurar las variables de entorno BD_USER, BD_PASSWORD y BD_CONNECTION_STRING")
    return user, password, connection_string