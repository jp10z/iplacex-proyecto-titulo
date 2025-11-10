import { Route, Routes, useNavigate } from "react-router-dom";
import { DashboardPage } from "./dashboard";
import { UsuariosPage } from "./usuarios";
import { ProyectosPage } from "./proyectos";
import { ServidoresPage } from "./servidores";
import { EventosPage } from "./eventos";
import { ErrorPage404 } from "@/pages/error/404";
import { Navbar } from "@/components/navbar";
import { useSesion } from "@/context/SesionContext";
import { logout } from "@/api/auth";
import { useState } from "react";

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
    const [realizandoLogout, setRealizandoLogout] = useState(false);
    const navigate = useNavigate();

    if (fetchingDatosSesion) {
        return <div>Validando sesión...</div>;
    }

    if (!autenticado || !datosSesion) {
        navigate("/login");
        return null;
    }

    function doLogout() {
        setRealizandoLogout(true);
        logout().finally(() => {
            clearSesion();
            navigate("/login");
        });
        
    }

    if (realizandoLogout) {
        return <div>Cerrando sesión...</div>;
    }

    return (
        <>
        <Navbar
            links={NAVBAR_LINKS}
            nombreUsuario={datosSesion.nombre_usuario}
            correoUsuario={datosSesion.correo_usuario}
            nombreRol={datosSesion.nombre_rol}
            logout={doLogout}
        />
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