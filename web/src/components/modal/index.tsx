import classes from "./index.module.css";

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
        <div className={classes.modal}>
            <div className={classes.modalContenido}>
                <div className={classes.modalHeader}>
                    <h2>{titulo}</h2>
                    {cerrarModal && !deshabilitarCerrar && <span className={classes.modalCerrar} onClick={cerrarModal}>X</span>}
                </div>
                <div className={classes.modalCuerpo}>
                    {children}
                </div>
            </div>
        </div>
    );
}