import { Route, Routes, useNavigate } from "react-router-dom";
import { DashboardPage } from "./dashboard";
import { UsuariosPage } from "./usuarios";
import { ProyectosPage } from "./proyectos";
import { ServidoresPage } from "./servidores";
import { EventosPage } from "./eventos";
import { ErrorPage404 } from "@/pages/error/404";
import { Navbar, type Link } from "@/components/navbar";
import { useSesion } from "@/context/SesionContext";
import { logout } from "@/api/auth";
import { useState } from "react";
import { OverlayCarga } from "@/components/overlay-carga";

export function ConsolaPage() {
    const { datosSesion, autenticado, fetchingDatosSesion, clearSesion } = useSesion();
    const [realizandoLogout, setRealizandoLogout] = useState(false);
    const navigate = useNavigate();

    if (fetchingDatosSesion) {
        return (
            <div style={{marginTop: "150px"}}>
                <OverlayCarga cargando={true} texto="Validando sesión...">&nbsp;</OverlayCarga>
            </div>
        );
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
        return (
            <div style={{marginTop: "40px"}}>
                <OverlayCarga cargando={true} texto="Cerrando sesión...">&nbsp;</OverlayCarga>
            </div>
        );
    }

    const rutas: Link[] = [
        { texto: "Dashboard", url: "/consola" },
    ];
    if (datosSesion.nombre_rol === "ADMIN") {
        rutas.push(
            { texto: "Administración", sublinks: [
                { texto: "Usuarios",  url: "/consola/usuarios", icono: "users" },
                { texto: "Servidores", url: "/consola/servidores", icono: "device-desktop" },
                { texto: "Proyectos", url: "/consola/proyectos", icono: "stack-2" },
                { texto: "Eventos", url: "/consola/eventos", icono: "clock" },
            ] }
        );
    }

    return (
        <>
        <Navbar
            links={rutas}
            nombreUsuario={datosSesion.nombre_usuario}
            correoUsuario={datosSesion.correo_usuario}
            nombreRol={datosSesion.nombre_rol}
            logout={doLogout}
        />
        <div style={{ margin: "10px" }}>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                {datosSesion.nombre_rol === "ADMIN" &&
                    <>
                        <Route path="/usuarios" element={<UsuariosPage />} />
                        <Route path="/proyectos" element={<ProyectosPage />} />
                        <Route path="/servidores" element={<ServidoresPage />} />
                        <Route path="/eventos" element={<EventosPage />} />
                    </>
                }
                <Route path="*" element={<ErrorPage404 />} />
            </Routes>
        </div>
      </>
    );
}