import classes from './index.module.css';

type Props = {
    cargando: boolean;
    children: React.ReactNode;
}

export function OverlayCarga({ cargando, children }: Props) {
    return (
        <div className={classes.overlayCarga}>
            {cargando && (
                <div className={classes.overlayCargaMensaje}>
                    <p>Cargando...</p>
                </div>
            )}
            {children}
        </div>
    );
}