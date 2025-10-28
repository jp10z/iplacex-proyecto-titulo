type Props = {
    paginacionActual: number;
    totalPaginas: number;
    onPaginaChange: (nuevaPagina: number) => void;
    cargando?: boolean;
}

export function PaginacionFooter({ paginacionActual, totalPaginas, onPaginaChange, cargando = false }: Props) {
    return (
        <div style={{ marginTop: "8px", display: "flex", justifyContent: "right", gap: "4px" }}>
            <p style={{ display: "flex", alignItems: "center" }}>Página {paginacionActual} de {totalPaginas}</p>
            <button
                disabled={paginacionActual <= 1 || cargando}
                onClick={() => {
                    if (paginacionActual > 1) {
                        onPaginaChange(paginacionActual - 1);
                    }
                }}
            >
                Anterior
            </button>
            <button
                disabled={paginacionActual >= Math.ceil(totalPaginas) || cargando}
                onClick={() => {
                    if (paginacionActual < Math.ceil(totalPaginas)) {
                        onPaginaChange(paginacionActual + 1);
                    }
                }}
            >
                Siguiente
            </button>
        </div>
    );
}