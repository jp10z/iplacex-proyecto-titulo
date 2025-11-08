import { useState, useEffect } from "react";
import type { IEventosResponse, IEvento } from "@/interfaces/eventos";
import { obtenerEventos } from "@/api/eventos";
import { DatosEventoModal } from "./DatosEvento";
import { OverlayCarga } from "@/components/overlay-carga";
import { PaginacionFooter } from "@/components/paginacion-footer";
import { toast } from "@/common/toast";
import { EVENTOS } from "@/common/eventos";

const obtenerFechaInicial = () => {
    const date = new Date();
    const isoDateString = date.toISOString(); 
    return isoDateString.substring(0, 10); 
};

export function EventosPage() {
    const [cargando, setCargando] = useState(true);
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [paginacion, setPaginacion] = useState({ index: 1, size: 10 });
    const [eventos, setEventos] = useState<IEventosResponse>({ items: [], total: 0 });
    const [eventoSeleccionado, setEventoSeleccionado] = useState<IEvento | undefined>(undefined);
    const [filtroFechaDesde, setFiltroFechaDesde] = useState<string>(obtenerFechaInicial());
    const [filtroFechaHasta, setFiltroFechaHasta] = useState<string>(obtenerFechaInicial());
    const [modalDatosEventoAbierto, setModalDatosEventoAbierto] = useState(false);

    function cargarEventos() {
        console.log("Cargando eventos con filtro:", { textoBusqueda, paginacion, filtroFechaDesde, filtroFechaHasta });
        setCargando(true);
        obtenerEventos(paginacion.index, paginacion.size, textoBusqueda, filtroFechaDesde, filtroFechaHasta)
            .then((response) => {
                setEventos(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener los eventos:", error);
                toast.error("Error al obtener los eventos.");
            })
            .finally(() => {
                setCargando(false);
            });
    }

    useEffect(() => {
        // Cargar lista de eventos cuando se ingresa a la página
        cargarEventos();
    }, [paginacion, filtroFechaDesde, filtroFechaHasta]);

    return (
        <>
            <h1>Eventos</h1>
            <div className="contenedor-responsivo" style={{ marginTop: "4px", marginBottom: "8px" }}>
                <div>
                    <label htmlFor="fecha-desde">Desde:</label>
                    <input type="date" id="fecha-desde" name="fecha-desde" value={filtroFechaDesde} onChange={(e) => setFiltroFechaDesde(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="fecha-hasta">Hasta:</label>
                    <input type="date" id="fecha-hasta" name="fecha-hasta" value={filtroFechaHasta} onChange={(e) => setFiltroFechaHasta(e.target.value)} />
                </div>
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
                                <th>Evento</th>
                                <th>Fecha y hora</th>
                                <th>Detalle</th>
                                <th>Usuario</th>
                                <th>Servidor</th>
                                <th style={{ width: "80px" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventos.items.length > 0 && eventos.items.map((evento) => (
                                <tr key={evento.id}>
                                    <td>{ EVENTOS[evento.nombre_tipo_evento as keyof typeof EVENTOS] }</td>
                                    <td>{evento.fecha_creacion}</td>
                                    <td>{evento.detalle}</td>
                                    <td>{evento.nombre_usuario}</td>
                                    <td>{evento.nombre_servidor}</td>
                                    <td>
                                        <button onClick={() => {
                                            setEventoSeleccionado(evento);
                                            setModalDatosEventoAbierto(true);
                                        }}>Ver datos</button>
                                    </td>
                                </tr>
                            ))}
                            {!cargando && eventos.items.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center", height: "50px" }}>No se encontraron eventos.</td>
                                </tr>
                            )}
                            {cargando && eventos.items.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ height: "50px" }}></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                            </OverlayCarga>
                </div>
            </div>
            <PaginacionFooter
                paginacionActual={paginacion.index}
                totalPaginas={Math.ceil(eventos.total / paginacion.size)}
                onPaginaChange={(nuevaPagina) => setPaginacion({ ...paginacion, index: nuevaPagina })}
                cargando={cargando}
            />
            <DatosEventoModal
                modalAbierto={modalDatosEventoAbierto}
                cerrarModal={() => setModalDatosEventoAbierto(false)}
                evento={eventoSeleccionado}
            />
        </>
    );
}