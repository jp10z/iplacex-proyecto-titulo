import logging, os, sys

logger = logging.getLogger(__name__)

FORMATO_CONSOLA = "%(asctime)s.%(msecs)03d - %(levelname)s - %(name)s - %(message)s"

def configurar_logger():
    level = get_level()
    # preparar controlador de consola
    controlador = logging.StreamHandler(sys.stdout)
    controlador.setFormatter(logging.Formatter(FORMATO_CONSOLA, "%Y-%m-%d %H:%M:%S"))
    # configurar
    logging.basicConfig(
        level=level,
        handlers=[controlador]
    )
    logger.info(f"Logger configurado correctamente con nivel {level}")

def get_level():
    # leer el nivel de logging desde las variables de entorno
    # por defecto uso INFO
    env_level = os.getenv("LOGGER_LEVEL", "INFO").upper()
    match env_level:
        case "DEBUG":
            return logging.DEBUG
        case "INFO":
            return logging.INFO
        case "WARNING":
            return logging.WARNING
        case "ERROR":
            return logging.ERROR
        case "CRITICAL":
            return logging.CRITICAL
        case _:
            logger.warning(f"Nivel de logs desconocido '{env_level}', usando INFO por defecto")
            return logging.INFO