import { useState, useEffect } from "react";
import type { IUsuariosResponse, IUsuario } from "@/interfaces/usuarios";
import { obtenerUsuarios } from "@/api/usuarios";
import { AgregarUsuarioModal } from "./AgregarUsuario";
import { ModificarUsuarioModal } from "./ModificarUsuario";
import { DeshabilitarUsuarioModal } from "./DeshabilitarUsuario";
import { OverlayCarga } from "@/components/overlay-carga";
import { PaginacionFooter } from "@/components/paginacion-footer";

export function UsuariosPage() {
    const [cargando, setCargando] = useState(true);
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [paginacion, setPaginacion] = useState({ index: 1, size: 10 });
    const [usuarios, setUsuarios] = useState<IUsuariosResponse>({ items: [], total: 0 });
    const [modalAgregarUsuarioAbierto, setModalAgregarUsuarioAbierto] = useState(false);
    const [modalModificarUsuarioAbierto, setModalModificarUsuarioAbierto] = useState(false);
    const [modalDeshabilitarUsuarioAbierto, setModalDeshabilitarUsuarioAbierto] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<IUsuario | undefined>(undefined);

    function cargarUsuarios() {
        setCargando(true);
        obtenerUsuarios(paginacion.index, paginacion.size, textoBusqueda)
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
    }, [paginacion]);

    return (
        <>
            <h1>Usuarios</h1>
            <div className="contenedor-responsivo" style={{ marginTop: "4px", marginBottom: "8px" }}>
                <button disabled={cargando} onClick={() => setModalAgregarUsuarioAbierto(true)}>Agregar usuario</button>
                <input 
                    className="item-full"
                    type="text" placeholder="Buscar..."
                    value={textoBusqueda}
                    readOnly={cargando}
                    onChange={(e) => setTextoBusqueda(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            // Truco para reiniciar la paginación al buscar, esto fuerza el useEffect a recargar los usuarios
                            setPaginacion({ ...paginacion, index: 1 });
                        }
                    }}
                />
            </div>
            <div style={{ marginTop: "8px"}}>
                <div className="tabla-contenedor">
                            <OverlayCarga cargando={cargando}>
                    <table className="tabla-datos">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th style={{ width: "150px" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                                {usuarios.items.length > 0 && usuarios.items.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.correo}</td>
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
                                {!cargando && usuarios.items.length === 0 && (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: "center", height: "50px" }}>No se encontraron usuarios.</td>
                                    </tr>
                                )}
                                {cargando && usuarios.items.length === 0 && (
                                    <tr>
                                        <td colSpan={4} style={{ height: "50px" }}></td>
                                    </tr>
                                )}
                            </tbody>
                    </table>
                            </OverlayCarga>
                </div>
            </div>
            <PaginacionFooter
                paginacionActual={paginacion.index}
                totalPaginas={Math.ceil(usuarios.total / paginacion.size)}
                onPaginaChange={(nuevaPagina) => setPaginacion({ ...paginacion, index: nuevaPagina })}
                cargando={cargando}
            />
            <AgregarUsuarioModal
                modalAbierto={modalAgregarUsuarioAbierto}
                cerrarModal={(recargar) => {
                    setModalAgregarUsuarioAbierto(false);
                    if (recargar) {
                        setPaginacion({ ...paginacion, index: 1 });
                    }
                }}
            />
            <DeshabilitarUsuarioModal
                modalAbierto={modalDeshabilitarUsuarioAbierto}
                cerrarModal={(recargar) => {
                    setModalDeshabilitarUsuarioAbierto(false);
                    if (recargar) {
                        setPaginacion({ ...paginacion, index: 1 });
                    }
                }}
                usuario={usuarioSeleccionado}
            />
            <ModificarUsuarioModal
                modalAbierto={modalModificarUsuarioAbierto}
                cerrarModal={(recargar) => {
                    setModalModificarUsuarioAbierto(false);
                    if (recargar) {
                        setPaginacion({ ...paginacion, index: 1 });
                    }
                }}
                usuario={usuarioSeleccionado}
            />
        </>
    );
}