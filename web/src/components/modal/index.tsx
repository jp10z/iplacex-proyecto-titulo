type Props = {
    modalAbierto: boolean;
    cerrarModal?: () => void;
    titulo: string;
    children: React.ReactNode;
    deshabilitarCerrar?: boolean;
}

export function Modal({ modalAbierto, titulo, children, cerrarModal, deshabilitarCerrar = false }: Props) {
    if (!modalAbierto) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-contenido">
                <div className="modal-header">
                    <h2>{titulo}</h2>
                    {cerrarModal && !deshabilitarCerrar && <span className="modal-cerrar" onClick={cerrarModal}>X</span>}
                </div>
                <div className="modal-cuerpo">
                    {children}
                </div>
            </div>
        </div>
    );
}