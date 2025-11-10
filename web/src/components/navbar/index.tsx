import { useNavigate } from "react-router-dom";
import classes from "./index.module.css";

type Link = {
    texto: string;
    url?: string;
    sublinks?: Array<Link>;
}

type Props = {
    links: Array<Link>;
    nombreUsuario: string;
    correoUsuario: string;
    nombreRol: string;
    logout: () => void;
}

export function Navbar({ links, nombreUsuario, correoUsuario, nombreRol, logout }: Props) {
    const navigate = useNavigate();

    function navegarA(e: React.MouseEvent<HTMLAnchorElement>, url?: string) {
        // Evitar que la página se cargue de nuevo
        e.preventDefault();
        if (!url) return;
        navigate(url);
    }

    return (
        <nav className={classes.navbar}>
            <ul>
                {links?.map((link, index) => (
                    <li key={index} className={classes.mainLink}>
                        <a href={link.url} onClick={(e) => navegarA(e, link.url)}>{link.texto}</a>
                        {link.sublinks && link.sublinks.length > 0 && (
                            <ul className={classes.submenu} style={{left: 0}}>
                                {link.sublinks.map((sublink, subindex) => (
                                    <li key={subindex}>
                                        <a href={sublink.url} onClick={(e) => navegarA(e, sublink.url)}>{sublink.texto}</a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
            <ul>
                <li className={classes.mainLink}>
                    <a>{nombreUsuario} </a>
                    <ul className={classes.submenu} style={{right: 0}}>
                        <li>{correoUsuario}</li>
                        <li>{nombreRol}</li>
                        <a onClick={logout}>Cerrar sesión</a>
                    </ul>
                </li>
            </ul>
        </nav>
    );
}
