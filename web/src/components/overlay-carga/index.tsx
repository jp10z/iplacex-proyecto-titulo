import classes from "./index.module.css";
import { Icono } from "@/components/icono";

type Props = {
    texto?: string;
    cargando: boolean;
    children: React.ReactNode;
}

export function OverlayCarga({ cargando, texto = "Cargando...", children }: Props) {
    return (
        <div className={classes.overlayCarga}>
            {cargando && (
                <div className={classes.overlayCargaMensaje}>
                    <Icono icono="cargando" tamano={24} />
                    <p>{texto}</p>
                </div>
            )}
            {children}
        </div>
    );
}