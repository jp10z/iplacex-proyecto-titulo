from werkzeug.security import generate_password_hash, check_password_hash

def generar_hash_contrasenia(contrasenia: str):
    return generate_password_hash(contrasenia)

def verificar_contrasenia(contrasenia: str, hash_contrasenia: str):
    return check_password_hash(hash_contrasenia, contrasenia)