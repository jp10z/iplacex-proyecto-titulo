import { useNavigate } from "react-router-dom";

export type Link = {
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
        <nav className="navbar">
            <ul>
                {links?.map((link, index) => (
                    <li key={index} className="main-link">
                        <a href={link.url} onClick={(e) => navegarA(e, link.url)}>{link.texto}</a>
                        {link.sublinks && link.sublinks.length > 0 && (
                            <ul className="submenu" style={{left: 0}}>
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
                <li className="main-link">
                    <a>{nombreUsuario} </a>
                    <ul className="submenu" style={{right: 0}}>
                        <li>
                            <ul className="datos-usuario">
                                <li>{correoUsuario}</li>
                                <li>{nombreRol}</li>
                            </ul>
                        </li>
                        <li><a onClick={logout}>Cerrar sesión</a></li>

                    </ul>
                </li>
            </ul>
        </nav>
    );
}
