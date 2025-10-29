import { useState, useEffect } from "react";
import type { IProyectosResponse, IProyecto } from "@/interfaces/proyectos";
import { obtenerProyectos } from "@/api/proyectos";
import { AgregarProyectoModal } from "./AgregarProyecto";
import { ModificarProyectoModal } from "./ModificarProyecto";
import { DeshabilitarProyectoModal } from "./DeshabilitarProyecto";
import { OverlayCarga } from "@/components/overlay-carga";
import { PaginacionFooter } from "@/components/paginacion-footer";
import { toast } from "@/common/toast";

export function ProyectosPage() {
    const [cargando, setCargando] = useState(true);
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [paginacion, setPaginacion] = useState({ index: 1, size: 10 });
    const [proyectos, setProyectos] = useState<IProyectosResponse>({ items: [], total: 0 });
    const [modalAgregarProyectoAbierto, setModalAgregarProyectoAbierto] = useState(false);
    const [modalModificarProyectoAbierto, setModalModificarProyectoAbierto] = useState(false);
    const [modalDeshabilitarProyectoAbierto, setModalDeshabilitarProyectoAbierto] = useState(false);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState<IProyecto | undefined>(undefined);

    function cargarProyectos() {
        setCargando(true);
        obtenerProyectos(paginacion.index, paginacion.size, textoBusqueda)
            .then((response) => {
                setProyectos(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener los proyectos:", error);
                toast.error("Error al obtener los proyectos.");
            })
            .finally(() => {
                setCargando(false);
            });
    }

    useEffect(() => {
        // Cargar proyectos cuando se ingresa a la página
        cargarProyectos();
    }, [paginacion]);

    return (
        <>
            <h1>Proyectos</h1>
            <div className="contenedor-responsivo" style={{ marginTop: "4px", marginBottom: "8px" }}>
                <button disabled={cargando} onClick={() => setModalAgregarProyectoAbierto(true)}>Agregar proyecto</button>
                <input
                    className="item-full"
                    type="text" placeholder="Buscar..."
                    value={textoBusqueda}
                    readOnly={cargando}
                    onChange={(e) => setTextoBusqueda(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            // Truco para reiniciar la paginación al buscar, esto fuerza el useEffect a recargar los proyectos
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
                                <th>Descripción</th>
                                <th>Servidores</th>
                                <th style={{ width: "150px" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                                {proyectos.items.length > 0 && proyectos.items.map((proyecto) => (
                                    <tr key={proyecto.id}>
                                        <td>{proyecto.nombre}</td>
                                        <td>{proyecto.descripcion}</td>
                                        <td>{proyecto.servidores}</td>
                                        <td>
                                            <button onClick={() => {
                                                setProyectoSeleccionado(proyecto);
                                                setModalModificarProyectoAbierto(true);
                                            }}>Modificar</button>
                                            <button onClick={() => {
                                                setProyectoSeleccionado(proyecto);
                                                setModalDeshabilitarProyectoAbierto(true);
                                            }}>Deshabilitar</button>
                                        </td>
                                    </tr>
                                ))}
                                {!cargando && proyectos.items.length === 0 && (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: "center", height: "50px" }}>No se encontraron proyectos.</td>
                                    </tr>
                                )}
                                {cargando && proyectos.items.length === 0 && (
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
                totalPaginas={Math.ceil(proyectos.total / paginacion.size)}
                onPaginaChange={(nuevaPagina) => setPaginacion({ ...paginacion, index: nuevaPagina })}
                cargando={cargando}
            />
            <AgregarProyectoModal
                modalAbierto={modalAgregarProyectoAbierto}
                cerrarModal={(recargar) => {
                    setModalAgregarProyectoAbierto(false);
                    if (recargar) {
                        setPaginacion({ ...paginacion, index: 1 });
                    }
                }}
            />
            <DeshabilitarProyectoModal
                modalAbierto={modalDeshabilitarProyectoAbierto}
                cerrarModal={(recargar) => {
                    setModalDeshabilitarProyectoAbierto(false);
                    if (recargar) {
                        setPaginacion({ ...paginacion, index: 1 });
                    }
                }}
                proyecto={proyectoSeleccionado}
            />
            <ModificarProyectoModal
                modalAbierto={modalModificarProyectoAbierto}
                cerrarModal={(recargar) => {
                    setModalModificarProyectoAbierto(false);
                    if (recargar) {
                        setPaginacion({ ...paginacion, index: 1 });
                    }
                }}
                proyecto={proyectoSeleccionado}
            />
        </>
    );
}