from datetime import datetime

def obtener_query_paginacion(query_base: str, ordenar_columna: str, ordenar_direccion: str, pagina_index: int, pagina_size: int) -> str:
    direccion_sql = "ASC" if ordenar_direccion.lower() == "asc" else "DESC"
    offset = (pagina_index - 1) * pagina_size
    paginacion_sql = f"""
        ORDER BY {ordenar_columna} {direccion_sql}
        OFFSET {offset} ROWS FETCH NEXT {pagina_size} ROWS ONLY
    """
    return query_base + paginacion_sql