import { useState, useEffect, useRef } from "react";
import type { IDashboardEstadosResponse, IServidorEstado } from "@/interfaces/dashboard";
import type { IProyectosListaResponse } from "@/interfaces/proyectos";
import { obtenerEstadosServidores } from "@/api/dashboard";
import { obtenerListaProyectos } from "@/api/proyectos";
// import { AgregarServidorModal } from "./AgregarServidor";
// import { ModificarServidorModal } from "./ModificarServidor";
// import { DeshabilitarServidorModal } from "./DeshabilitarServidor";
import { OverlayCarga } from "@/components/overlay-carga";
import { toast } from "@/common/toast";

export function DashboardPage() {
    const [cargandoProyectos, setCargandoProyectos] = useState(true);
    const [cargandoServidores, setCargandoServidores] = useState(false);
    const [primeraCargaServidores, setPrimeraCargaServidores] = useState(true);
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [servidores, setServidores] = useState<IDashboardEstadosResponse>({ items: [] });
    const [proyectos, setProyectos] = useState<IProyectosListaResponse>({ items: [] });
    // const [modalAgregarServidorAbierto, setModalAgregarServidorAbierto] = useState(false);
    // const [modalModificarServidorAbierto, setModalModificarServidorAbierto] = useState(false);
    // const [modalDeshabilitarServidorAbierto, setModalDeshabilitarServidorAbierto] = useState(false);
    const [servidorSeleccionado, setServidorSeleccionado] = useState<IServidorEstado | undefined>(undefined);
    const [proyectoSeleccionadoId, setProyectoSeleccionadoId] = useState<number | undefined>(undefined);
    const [servidoresFiltrados, setServidoresFiltrados] = useState<IServidorEstado[]>([]);

    const intervaloRef = useRef<number | undefined>(undefined);

    function cargarServidores(idProyecto: number) {
        setCargandoServidores(true);
        obtenerEstadosServidores(idProyecto)
            .then((response) => {
                setServidores(response.data);
                setPrimeraCargaServidores(false);
            })
            .catch((error) => {
                console.error("Error al obtener los servidores:", error);
                toast.error("Error al obtener los servidores.");
            })
            .finally(() => {
                setCargandoServidores(false);
            });
    }

    function cargarListaProyectos() {
        obtenerListaProyectos()
            .then((response) => {
                setProyectos(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener la lista de proyectos:", error);
                toast.error("Error al obtener la lista de proyectos.");
            })
            .finally(() => {
                setCargandoProyectos(false);
            });
    }

    function obtenerEstado(servidor: IServidorEstado) {
        // retornar disponible: si es null
        if (servidor.fecha_acceso === null || servidor.duracion_minutos === null) {
            return {
                estado: 'disponible',
                minutosRestantes: null,
            };
        }
        // calculos de fechas/horas
        const fechaHoraActual = new Date();
        const fechaAcceso = new Date(servidor.fecha_acceso);
        const fechaCaducidadMinutos = fechaAcceso.getTime() + (servidor.duracion_minutos * 60 * 1000);
        const fechaCaducidad = new Date(fechaCaducidadMinutos);
        // retornar disponible: si la fecha de caducidad es menor a la fecha/hora actual
        if (fechaCaducidad.getTime() < fechaHoraActual.getTime()) {
            return {
                estado: 'disponible',
                minutosRestantes: null,
            };
        }
        // retornar ocupado: con los minutos restantes
        const diferenciaMinutos = fechaCaducidad.getTime() - fechaHoraActual.getTime();
        const minutosRestantes = Math.ceil(diferenciaMinutos / (60 * 1000));
        return {
            estado: 'ocupado',
            minutosRestantes,
        };
    }

    function normalizarTexto(texto: string) {
        // normaliza el texto para que al buscar no sea sensible a tildes ni mayusculas/minusculas
        return texto.normalize?.('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    function filtrarServidores() {
        // Filtra los servidores según el texto de busqueda puesto
        if (textoBusqueda.trim() === "") {
            setServidoresFiltrados(servidores.items);
            return;
        }
        const texto = normalizarTexto(textoBusqueda.trim());
        const filtrados = servidores.items.filter(servidor =>
            normalizarTexto(servidor.nombre ?? '').includes(texto)
        );
        setServidoresFiltrados(filtrados);
    }

    useEffect(() => {
        // Cargar lista de proyectos cuando se carga la pagina
        cargarListaProyectos();
    }, []);

    useEffect(() => {
        // configurar la actualización automática de los servidores cada 20 segundos

        // detener el intervalo si se seleccionó otro proyecto
        if (intervaloRef.current !== undefined) {
            clearInterval(intervaloRef.current);
            intervaloRef.current = undefined;
        }
        // en caso de que no se haya seleccionado ningún proyecto
        if (!proyectoSeleccionadoId) {
            setServidores({ items: [] });
            setCargandoServidores(false);
            return;
        }
        // lo que se ejecutará cada x tiempo
        const fetchData = () => cargarServidores(proyectoSeleccionadoId);
        // ejecutar inmediatamente la primera vez
        fetchData();
        // configurar para que se ejecute cada 20 segundos
        const id = setInterval(fetchData, 20000) as unknown as number;
        intervaloRef.current = id;
        // limpieza al salir o cambiar de proyecto
        return () => {
            if (intervaloRef.current !== undefined) {
                clearInterval(intervaloRef.current);
                intervaloRef.current = undefined;
            }
        };

    }, [proyectoSeleccionadoId]);

    useEffect(() => {
        // Filtrar servidores cuando cambie el texto de búsqueda o la lista de servidores
        filtrarServidores();
    }, [textoBusqueda, servidores]);

    return (
        <>
            <h1>Dashboard</h1>
            <div className="contenedor-responsivo" style={{ marginTop: "4px", marginBottom: "8px" }}>
                <select
                    className="item-auto"
                    value={proyectoSeleccionadoId ?? ""}
                    onChange={(e) => {
                        const valor = e.target.value;
                        if (valor === "") {
                            setProyectoSeleccionadoId(undefined);
                        } else {
                            setProyectoSeleccionadoId(Number(valor));
                            setCargandoServidores(true);
                            setPrimeraCargaServidores(true);
                        }
                    }}
                >
                    <option value="">-- Seleccionar proyecto --</option>
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
                    onChange={(e) => setTextoBusqueda(e.target.value)}
                />
            </div>
            {cargandoProyectos && (
                <div style={{ marginTop: "8px"}}>
                    <div className="tabla-contenedor">
                        <OverlayCarga cargando={cargandoProyectos} texto="Cargando lista de proyectos...">&nbsp;</OverlayCarga>
                    </div>
                </div>
            )}
            {!cargandoProyectos && !proyectoSeleccionadoId && (
                <div style={{ marginTop: "8px"}}>
                    <div className="tabla-contenedor">
                        <OverlayCarga cargando={true} texto="Seleccione un proyecto">&nbsp;</OverlayCarga>
                    </div>
                </div>
            )}
            {!cargandoProyectos && proyectoSeleccionadoId && (
            <div style={{ marginTop: "8px"}}>
                <div className="tabla-contenedor">
                    <OverlayCarga cargando={cargandoServidores && primeraCargaServidores}>
                        <table className="tabla-datos">
                            <thead>
                                <tr>
                                    <th>Estado</th>
                                    <th>Servidor</th>
                                    <th>Proyecto</th>
                                    <th style={{ width: "150px" }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {servidoresFiltrados.length > 0 && servidoresFiltrados .map((servidor) => {
                                        const { estado, minutosRestantes } = obtenerEstado(servidor);
                                        return (
                                            <tr key={servidor.id}>
                                            <td>
                                                {estado === 'ocupado' ? (
                                                    <p>Ocupado ({minutosRestantes} minutos pendientes)</p>
                                                ) : (
                                                    <p>Disponible</p>
                                                )}
                                            </td>
                                            <td>{servidor.nombre}</td>
                                            <td>{servidor.nombre_proyecto}</td>
                                            <td>
                                                {estado === 'ocupado' && (
                                                    <button>Ver detalles</button>
                                                )}
                                                {estado === 'disponible' && (
                                                    <button>Reservar ahora</button>
                                                )}
                                            </td>
                                        </tr>
                                        )
                                    })}
                                    {!cargandoServidores && servidores.items.length !== 0 && servidoresFiltrados.length === 0 && (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: "center", height: "50px" }}>No se encontraron servidores con el texto de busqueda.</td>
                                        </tr>
                                    )}
                                    {!cargandoServidores && servidores.items.length === 0 && (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: "center", height: "50px" }}>No se encontraron servidores en el proyecto seleccionado.</td>
                                        </tr>
                                    )}
                                    {cargandoServidores && servidores.items.length === 0 && (
                                        <tr>
                                            <td colSpan={4} style={{ height: "50px" }}></td>
                                        </tr>
                                    )}
                                </tbody>
                        </table>
                    </OverlayCarga>
                </div>
            </div>
            )}
        </>
    );
}