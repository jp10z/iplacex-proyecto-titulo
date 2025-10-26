import classes from "./index.module.css";

type Props = {
    modalAbierto: boolean;
    cerrarModal?: () => void;
    titulo: string;
    children: React.ReactNode;
}

export function Modal({ modalAbierto, titulo, children, cerrarModal }: Props) {
    if (!modalAbierto) {
        return null;
    }

    return (
        <div className={classes.modal}>
            <div className={classes.modalContenido}>
                <div className={classes.modalHeader}>
                    <h2>{titulo}</h2>
                    {cerrarModal && <span className={classes.modalCerrar} onClick={cerrarModal}>X</span>}
                </div>
                <div className={classes.modalCuerpo}>
                    {children}
                </div>
            </div>
        </div>
    );
}