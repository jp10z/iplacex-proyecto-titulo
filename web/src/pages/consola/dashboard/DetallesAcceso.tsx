import { useState, useEffect } from "react";
import { Modal } from "@/components/modal";
import { obtenerDetallesAccesoServidor } from "@/api/dashboard";
import type { IServidorEstado } from "@/interfaces/dashboard";
import { OverlayCarga } from "@/components/overlay-carga";

type Props = {
    modalAbierto: boolean;
    cerrarModal: () => void;
    servidor?: IServidorEstado;
}

export function DetallesAccesoModal({ modalAbierto, cerrarModal, servidor }: Props) {
    const [cargando, setCargando] = useState(false);
    const [nombreServidor, setNombreServidor] = useState("");
    const [descripcionServidor, setDescripcionServidor] = useState("");
    const [nombreProyecto, setNombreProyecto] = useState("");
    const [fechaAcceso, setFechaAcceso] = useState("");
    const [duracionMinutos, setDuracionMinutos] = useState(0);
    const [notas, setNotas] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");

    function cargarDetallesAcceso() {
        if (!servidor) return;
        setCargando(true);
        obtenerDetallesAccesoServidor(servidor.id)
            .then((response) => {
                console.log("Detalles de acceso:", response.data);
                const datos = response.data.item;
                setNombreServidor(datos.nombre_servidor);
                setDescripcionServidor(datos.descripcion_servidor);
                setNombreProyecto(datos.nombre_proyecto);
                setFechaAcceso(datos.fecha_acceso);
                setDuracionMinutos(datos.duracion_minutos);
                setNotas(datos.notas || "(Sin notas)");
                setNombreUsuario(datos.nombre_usuario);
            })
            .catch((error) => {
                console.error("Error al cargar detalles de acceso:", error);
            })
            .finally(() => {
                setCargando(false);
            });
    }

    useEffect(() => {
        // Cuando se abra el modal que cargue los datos sino que limpie
        if (modalAbierto) {
            cargarDetallesAcceso();
        } else {
            setNombreServidor("");
            setDescripcionServidor("");
            setNombreProyecto("");
            setFechaAcceso("");
            setDuracionMinutos(0);
            setNotas("");
            setNombreUsuario("");
        }
        
    }, [modalAbierto]);

    return <Modal
        modalAbierto={modalAbierto}
        cerrarModal={cerrarModal}
        titulo="Detalles de Acceso"
        deshabilitarCerrar={cargando}
    >
        <OverlayCarga cargando={cargando}>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td><strong>Servidor:</strong></td>
                            <td>{nombreServidor || "Cargando..."}</td>
                        </tr>
                        <tr>
                            <td><strong>Descripción:</strong></td>
                            <td>{descripcionServidor || "Cargando..."}</td>
                        </tr>
                        <tr>
                            <td><strong>Proyecto:</strong></td>
                            <td>{nombreProyecto || "Cargando..."}</td>
                        </tr>
                        <tr>
                            <td><strong>Fecha de Acceso:</strong></td>
                            <td>{fechaAcceso || "Cargando..."}</td>
                        </tr>
                        <tr>
                            <td><strong>Duración (min):</strong></td>
                            <td>{duracionMinutos || "Cargando..."}</td>
                        </tr>
                        <tr>
                            <td><strong>Notas:</strong></td>
                            <td>{notas || "Cargando..."}</td>
                        </tr>
                        <tr>
                            <td><strong>Usuario:</strong></td>
                            <td>{nombreUsuario || "Cargando..."}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="modal-acciones">
                    <button onClick={cerrarModal}>Cerrar</button>
                </div>
            </div>
        </OverlayCarga>
    </Modal>
}
