import { useState, useEffect } from "react";
import type { IUsuario } from "@/interfaces/usuarios";
import { obtenerUsuarios } from "@/api/usuarios";
import { AgregarUsuarioModal } from "./AgregarUsuario";

export function UsuariosPage() {
    const [cargando, setCargando] = useState(false);
    const [buscarValue, setBuscarValue] = useState("");
    const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
    const [modalAgregarUsuarioAbierto, setModalAgregarUsuarioAbierto] = useState(false);

    function cargarUsuarios() {
        setCargando(true);
        obtenerUsuarios()
            .then((response) => {
                setUsuarios(response.data.datos);
            })
            .catch((error) => {
                console.error("Error al obtener los usuarios:", error);
            })
            .finally(() => {
                setCargando(false);
            });
    }

    function obtenerRolTexto(rol: string) {
        switch (rol) {
            case "ADMIN":
                return "Administrador";
            case "OPERADOR":
                return "Operador";
            default:
                return "Desconocido";
        }
    }

    useEffect(() => {
        cargarUsuarios();
    }, []);

    return (
        <>
            <h1>Usuarios</h1>
            <div style={{ marginTop: "4px"}}>
                <button onClick={() => setModalAgregarUsuarioAbierto(true)}>Agregar usuario</button>
                <input 
                    type="text" placeholder="Buscar..."
                    value={buscarValue}
                    onChange={(e) => setBuscarValue(e.target.value)}
                />
            </div>
            <div style={{ marginTop: "8px"}}>
                {usuarios.length > 0 && !cargando && (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Correo</th>
                                <th>Nombre</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.id}</td>
                                    <td>{usuario.correo}</td>
                                    <td>{usuario.nombre}</td>
                                    <td>{obtenerRolTexto(usuario.rol)}</td>
                                    <td>
                                        <button>Editar</button>
                                        <button>Deshabilitar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {cargando && <p>Cargando usuarios...</p>}
                {!cargando && usuarios.length === 0 && <p>No hay usuarios disponibles.</p>}
            </div>
            <AgregarUsuarioModal
                modalAbierto={modalAgregarUsuarioAbierto}
                cerrarModal={(recargar) => {
                    setModalAgregarUsuarioAbierto(false);
                    if (recargar) {
                        cargarUsuarios();
                    }
                }}
            />
        </>
    );
}