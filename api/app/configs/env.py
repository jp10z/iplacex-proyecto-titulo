from dotenv import load_dotenv

RUTA_ENV = ".env"

def cargar_archivo_env():
    # cargar variables de entorno desde el archivo .env en caso de que exista
    # esto me ayuda a no tener que configurar las variables de entorno en el sistema
    load_dotenv(dotenv_path=RUTA_ENV, override=True)