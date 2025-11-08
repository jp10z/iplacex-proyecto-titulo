import { useState, useEffect } from "react";
import { Modal } from "@/components/modal";
import { obtenerDatosEvento } from "@/api/eventos";
import type { IEvento } from "@/interfaces/eventos";
import { OverlayCarga } from "@/components/overlay-carga";
import { EVENTOS } from "@/common/eventos";

type Props = {
    modalAbierto: boolean;
    cerrarModal: () => void;
    evento?: IEvento;
}

export function DatosEventoModal({ modalAbierto, cerrarModal, evento }: Props) {
    const [cargando, setCargando] = useState(false);
    const [idEvento, setIdEvento] = useState<number | undefined>();
    const [nombreTipoEvento, setNombreTipoEvento] = useState("");
    const [detalle, setDetalle] = useState("");
    const [fechaCreacion, setFechaCreacion] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [nombreServidor, setNombreServidor] = useState<string | null>(null);
    const [datos, setDatos] = useState<Record<string, any> | null>(null);

    function cargarDatosEvento() {
        if (!evento) return;
        setCargando(true);
        obtenerDatosEvento(evento.id)
            .then((response) => {
                console.log("Datos del evento:", response.data);
                const eventoDatos = response.data.item;
                setIdEvento(eventoDatos.id);
                setNombreTipoEvento(eventoDatos.nombre_tipo_evento);
                setDetalle(eventoDatos.detalle);
                setFechaCreacion(eventoDatos.fecha_creacion);
                setNombreUsuario(eventoDatos.nombre_usuario);
                setNombreServidor(eventoDatos.nombre_servidor);
                setDatos(eventoDatos.datos);
            })
            .catch((error) => {
                console.error("Error al cargar detalles del evento:", error);
            })
            .finally(() => {
                setCargando(false);
            });
    }

    useEffect(() => {
        // Cuando se abra el modal que cargue los datos sino que limpie
        if (modalAbierto) {
            cargarDatosEvento();
        } else {
            setIdEvento(undefined);
            setNombreTipoEvento("");
            setDetalle("");
            setFechaCreacion("");
            setNombreUsuario("");
            setNombreServidor(null);
            setDatos(null);
        }
        
    }, [modalAbierto]);

    return <Modal
        modalAbierto={modalAbierto}
        cerrarModal={cerrarModal}
        titulo="Datos del evento"
        deshabilitarCerrar={cargando}
    >
        <OverlayCarga cargando={cargando}>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td><strong>ID Evento:</strong></td>
                            <td>{cargando ? "Cargando..." : idEvento}</td>
                        </tr>
                        <tr>
                            <td><strong>Evento:</strong></td>
                            <td>{cargando ? "Cargando..." : EVENTOS[nombreTipoEvento as keyof typeof EVENTOS]}</td>
                        </tr>
                        <tr>
                            <td><strong>Detalle:</strong></td>
                            <td>{cargando ? "Cargando..." : detalle}</td>
                        </tr>
                        <tr>
                            <td><strong>Fecha y hora:</strong></td>
                            <td>{cargando ? "Cargando..." : fechaCreacion}</td>
                        </tr>
                        <tr>
                            <td><strong>Usuario:</strong></td>
                            <td>{cargando ? "Cargando..." : nombreUsuario}</td>
                        </tr>
                        <tr>
                            <td><strong>Servidor:</strong></td>
                            <td>{cargando ? "Cargando..." : nombreServidor || "(Ninguno)"}</td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ marginTop: "8px" }}>
                    <pre className="json">{datos ? JSON.stringify(datos, null, 2) : "Cargando..."}</pre>
                </div>
                <div className="modal-acciones">
                    <button onClick={cerrarModal}>Cerrar</button>
                </div>
            </div>
        </OverlayCarga>
    </Modal>
}
