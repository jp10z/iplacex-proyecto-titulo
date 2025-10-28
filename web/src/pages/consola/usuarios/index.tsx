import { useState, useEffect } from "react";
import type { IUsuariosResponse, IUsuario } from "@/interfaces/usuarios";
import { obtenerUsuarios } from "@/api/usuarios";
import { AgregarUsuarioModal } from "./AgregarUsuario";
import { ModificarUsuarioModal } from "./ModificarUsuario";
import { DeshabilitarUsuarioModal } from "./DeshabilitarUsuario";

export function UsuariosPage() {
    const [cargando, setCargando] = useState(true);
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [paginacion, setPaginacion] = useState({ index: 1, size: 10 });
    const [ordenamiento, setOrdenamiento] = useState({columna: "nombre", direccion: "asc"});
    const [usuarios, setUsuarios] = useState<IUsuariosResponse>({ items: [], total: 0 });
    const [modalAgregarUsuarioAbierto, setModalAgregarUsuarioAbierto] = useState(false);
    const [modalModificarUsuarioAbierto, setModalModificarUsuarioAbierto] = useState(false);
    const [modalDeshabilitarUsuarioAbierto, setModalDeshabilitarUsuarioAbierto] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<IUsuario | undefined>(undefined);

    function cargarUsuarios() {
        setCargando(true);
        obtenerUsuarios(paginacion.index, paginacion.size, ordenamiento.columna, ordenamiento.direccion, textoBusqueda)
            .then((response) => {
                setUsuarios(response.data);
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
        // Cargar usuarios cuando se ingresa a la página
        cargarUsuarios();
    }, []);

    return (
        <>
            <h1>Usuarios</h1>
            <div className="contenedor-responsivo" style={{ marginTop: "4px", marginBottom: "8px" }}>
                <button onClick={() => setModalAgregarUsuarioAbierto(true)}>Agregar usuario</button>
                <input 
                    className="item-full"
                    type="text" placeholder="Buscar..."
                    value={textoBusqueda}
                    onChange={(e) => setTextoBusqueda(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            cargarUsuarios();
                        }
                    }}
                />
            </div>
            <div style={{ marginTop: "8px"}}>
                    <div className="tabla-contenedor">
                        <table className="tabla-datos">
                            <thead>
                                <tr>
                                    <th>Correo</th>
                                    <th>Nombre</th>
                                    <th>Rol</th>
                                    <th style={{ width: "150px" }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.items.length > 0 && !cargando && usuarios.items.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.correo}</td>
                                        <td>{usuario.nombre}</td>
                                        <td>{obtenerRolTexto(usuario.rol)}</td>
                                        <td>
                                            <button onClick={() => {
                                                setUsuarioSeleccionado(usuario);
                                                setModalModificarUsuarioAbierto(true);
                                            }}>Modificar</button>
                                            <button onClick={() => {
                                                setUsuarioSeleccionado(usuario);
                                                setModalDeshabilitarUsuarioAbierto(true);
                                            }}>Deshabilitar</button>
                                        </td>
                                    </tr>
                                ))}
                                {cargando && (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: "center", height: "50px" }}>Cargando usuarios...</td>
                                    </tr>
                                )}
                                {!cargando && usuarios.items.length === 0 && (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: "center", height: "50px" }}>No se encontraron usuarios.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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
            <DeshabilitarUsuarioModal
                modalAbierto={modalDeshabilitarUsuarioAbierto}
                cerrarModal={(recargar) => {
                    setModalDeshabilitarUsuarioAbierto(false);
                    if (recargar) {
                        cargarUsuarios();
                    }
                }}
                usuario={usuarioSeleccionado}
            />
            <ModificarUsuarioModal
                modalAbierto={modalModificarUsuarioAbierto}
                cerrarModal={(recargar) => {
                    setModalModificarUsuarioAbierto(false);
                    if (recargar) {
                        cargarUsuarios();
                    }
                }}
                usuario={usuarioSeleccionado}
            />
        </>
    );
}