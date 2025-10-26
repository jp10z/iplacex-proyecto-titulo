import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "./dashboard";
import { UsuariosPage } from "./usuarios";
import { ProyectosPage } from "./proyectos";
import { ServidoresPage } from "./servidores";

export function ConsolaPage() {
    return (
        <>
        <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/proyectos" element={<ProyectosPage />} />
            <Route path="/servidores" element={<ServidoresPage />} />
        </Routes>
      </>
    );
}