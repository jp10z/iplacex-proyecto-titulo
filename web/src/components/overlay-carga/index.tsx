import classes from './index.module.css';

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
                    <p>{texto}</p>
                </div>
            )}
            {children}
        </div>
    );
}