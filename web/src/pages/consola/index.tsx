import { Route, Routes, useNavigate } from "react-router-dom";
import { DashboardPage } from "./dashboard";
import { UsuariosPage } from "./usuarios";
import { ProyectosPage } from "./proyectos";
import { ServidoresPage } from "./servidores";
import { EventosPage } from "./eventos";
import { ErrorPage404 } from "@/pages/error/404";
import { Navbar } from "@/components/navbar";
import { useSesion } from "@/context/SesionContext";

const NAVBAR_LINKS = [
    { texto: "Dashboard", url: "/consola" },
    { texto: "Administración", sublinks: [
        { texto: "Usuarios",  url: "/consola/usuarios" },
        { texto: "Servidores", url: "/consola/servidores" },
        { texto: "Proyectos", url: "/consola/proyectos" },
        { texto: "Eventos", url: "/consola/eventos" }
    ] }
]

export function ConsolaPage() {
    const { datosSesion, autenticado, fetchingDatosSesion, clearSesion } = useSesion();
    const navigate = useNavigate();

    if (fetchingDatosSesion) {
        return <div>Validando sesión...</div>;
    }

    if (!autenticado) {
        navigate("/login");
        return null;
    }

    console.log("Datos de sesión:", datosSesion);

    return (
        <>
        <Navbar links={NAVBAR_LINKS} />
        <div style={{ margin: "10px" }}>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/usuarios" element={<UsuariosPage />} />
                <Route path="/proyectos" element={<ProyectosPage />} />
                <Route path="/servidores" element={<ServidoresPage />} />
                <Route path="/eventos" element={<EventosPage />} />
                <Route path="*" element={<ErrorPage404 />} />
            </Routes>
        </div>
      </>
    );
}