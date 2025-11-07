import { useState, useEffect } from "react";
import type { IServidoresResponse, IServidor } from "@/interfaces/servidores";
import type { IProyectosListaResponse } from "@/interfaces/proyectos";
import { obtenerServidores } from "@/api/servidores";
import { obtenerListaProyectos } from "@/api/proyectos";
import { AgregarServidorModal } from "./AgregarServidor";
import { ModificarServidorModal } from "./ModificarServidor";
import { DeshabilitarServidorModal } from "./DeshabilitarServidor";
import { OverlayCarga } from "@/components/overlay-carga";
import { PaginacionFooter } from "@/components/paginacion-footer";
import { toast } from "@/common/toast";

export function ServidoresPage() {
    const [cargando, setCargando] = useState(true);
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [paginacion, setPaginacion] = useState({ index: 1, size: 10 });
    const [servidores, setServidores] = useState<IServidoresResponse>({ items: [], total: 0 });
    const [proyectos, setProyectos] = useState<IProyectosListaResponse>({ items: [] });
    const [modalAgregarServidorAbierto, setModalAgregarServidorAbierto] = useState(false);
    const [modalModificarServidorAbierto, setModalModificarServidorAbierto] = useState(false);
    const [modalDeshabilitarServidorAbierto, setModalDeshabilitarServidorAbierto] = useState(false);
    const [servidorSeleccionado, setServidorSeleccionado] = useState<IServidor | undefined>(undefined);
    const [proyectoSeleccionadoId, setProyectoSeleccionadoId] = useState<number | undefined>(undefined);

    function cargarServidores() {
        obtenerServidores(paginacion.index, paginacion.size, textoBusqueda)
            .then((response) => {
                setServidores(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener los servidores:", error);
                toast.error("Error al obtener los servidores.");
            })
            .finally(() => {
                setCargando(false);
            });
    }

    function cargarListaProyectos() {
        setCargando(true);
        obtenerListaProyectos()
            .then((response) => {
                setProyectos(response.data);
                cargarServidores();
            })
            .catch((error) => {
                console.error("Error al obtener la lista de proyectos:", error);
                toast.error("Error al obtener la lista de proyectos.");
                setCargando(false);
            });
    }


    useEffect(() => {
        // Cargar lista de proyectos y servidores cuando se ingresa a la página
        cargarListaProyectos();
    }, [paginacion]);

    return (
        <>
            <h1>Servidores</h1>
            <div className="contenedor-responsivo" style={{ marginTop: "4px", marginBottom: "8px" }}>
                <button disabled={cargando} onClick={() => setModalAgregarServidorAbierto(true)}>Agregar servidor</button>
                <select
                    className="item-auto"
                    value={proyectoSeleccionadoId ?? ""}
                    onChange={(e) => {
                        const valor = e.target.value;
                        if (valor === "") {
                            setProyectoSeleccionadoId(undefined);
                        } else {
                            setProyectoSeleccionadoId(Number(valor));
                        }
                    }}
                    disabled={cargando}
                >
                    <option value="">-- Todos los proyectos --</option>
                    {proyectos.items.map((proyecto) => (
                        <option key={proyecto.id_proyecto} value={proyecto.id_proyecto}>
                            {proyecto.nombre}
                        </option>
                    ))}
                </select>
                <input
                    className="item-full"
                    type="text" placeholder="Buscar..."
                    value={textoBusqueda}
                    readOnly={cargando}
                    onChange={(e) => setTextoBusqueda(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
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
                                <th>Proyecto</th>
                                <th style={{ width: "150px" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                                {servidores.items.length > 0 && servidores.items.map((servidor) => (
                                    <tr key={servidor.id}>
                                        <td>{servidor.nombre}</td>
                                        <td>{servidor.descripcion}</td>
                                        <td>{servidor.nombre_proyecto}</td>
                                        <td>
                                            <button onClick={() => {
                                                setServidorSeleccionado(servidor);
                                                setModalModificarServidorAbierto(true);
                                            }}>Modificar</button>
                                            <button onClick={() => {
                                                setServidorSeleccionado(servidor);
                                                setModalDeshabilitarServidorAbierto(true);
                                            }}>Deshabilitar</button>
                                        </td>
                                    </tr>
                                ))}
                                {!cargando && servidores.items.length === 0 && (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: "center", height: "50px" }}>No se encontraron servidores.</td>
                                    </tr>
                                )}
                                {cargando && servidores.items.length === 0 && (
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
                totalPaginas={Math.ceil(servidores.total / paginacion.size)}
                onPaginaChange={(nuevaPagina) => setPaginacion({ ...paginacion, index: nuevaPagina })}
                cargando={cargando}
            />
            <AgregarServidorModal
                modalAbierto={modalAgregarServidorAbierto}
                cerrarModal={(recargar) => {
                    setModalAgregarServidorAbierto(false);
                    if (recargar) {
                        setPaginacion({ ...paginacion, index: 1 });
                    }
                }}
                listaProyectos={proyectos.items}
            />
           

            <DeshabilitarServidorModal
                modalAbierto={modalDeshabilitarServidorAbierto}
                cerrarModal={(recargar) => {
                    setModalDeshabilitarServidorAbierto(false);
                    if (recargar) {
                        setPaginacion({ ...paginacion, index: 1 });
                    }
                }}
                servidor={servidorSeleccionado}
            />
            <ModificarServidorModal
                modalAbierto={modalModificarServidorAbierto}
                cerrarModal={(recargar) => {
                    setModalModificarServidorAbierto(false);
                    if (recargar) {
                        setPaginacion({ ...paginacion, index: 1 });
                    }
                }}
                servidor={servidorSeleccionado}
                listaProyectos={proyectos.items}
            /> 
        </>
    );
}