import random, string

def generar_texto_aleatorio(cant_caracteres: int):
    # generar un texto aleatorio
    caracteres = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(caracteres) for _ in range(cant_caracteres))