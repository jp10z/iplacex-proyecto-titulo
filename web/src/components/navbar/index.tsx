import { useLocation, useNavigate } from "react-router-dom";

type Link = {
    texto: string;
    url?: string;
    sublinks?: Array<Link>;
}

type Props = {
    links: Array<Link>;
}

export function Navbar({ links }: Props) {
    const location = useLocation();
    const navigate = useNavigate();

    function navegarA(e: React.MouseEvent<HTMLAnchorElement>, url?: string) {
        // Evitar que la página se cargue de nuevo
        e.preventDefault();
        if (!url) return;
        navigate(url);
    }

    return (
        <nav>
            <ul>
                {links?.map((link, index) => (
                    <li key={index}>
                        <a href={link.url} onClick={(e) => navegarA(e, link.url)}>{link.texto}</a>
                        {link.sublinks && link.sublinks.length > 0 && (
                            <ul>
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
        </nav>
    );
}
