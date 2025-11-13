import { Icono } from "@/components/icono";

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
                    {cerrarModal && !deshabilitarCerrar && <button className="botton-icono" onClick={cerrarModal}><Icono icono="x" tamano={20} /></button>}
                </div>
                <div className="modal-cuerpo">
                    {children}
                </div>
            </div>
        </div>
    );
}