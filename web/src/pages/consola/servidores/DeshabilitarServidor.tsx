import { useState } from "react";
import { Modal } from "@/components/modal";
import type { IServidor } from "@/interfaces/servidores";
import { deshabilitarServidor } from "@/api/servidores";
import { toast } from "@/common/toast";
import { OverlayCarga } from "@/components/overlay-carga";

type Props = {
    modalAbierto: boolean;
    cerrarModal: (recargar: boolean) => void;
    servidor?: IServidor;
};

export function DeshabilitarServidorModal({ modalAbierto, cerrarModal, servidor }: Props) {
    const [cargando, setCargando] = useState(false);
    function doDeshabilitarServidor() {
        if (!servidor) {
            return;
        }
        setCargando(true);
        deshabilitarServidor(servidor.id)
            .then((response) => {
                console.log("Servidor deshabilitado:", response.data);
                toast.success("Servidor deshabilitado", "El servidor ha sido deshabilitado correctamente.");
                cerrarModal(true);
            })
            .catch((error) => {
                console.error("Error al deshabilitar el servidor:", error);
            })
            .finally(() => {
                setCargando(false);
            });
    }

    return <Modal
        modalAbierto={modalAbierto}
        cerrarModal={() => cerrarModal(false)}
        titulo="Deshabilitar Servidor"
        deshabilitarCerrar={cargando}
    >
        <OverlayCarga cargando={cargando}>
            <p>¿Estás seguro de que deseas deshabilitar el siguiente servidor?</p>
            {servidor && (
                <div style={{ marginTop: "12px" }}>
                    <p><strong>Nombre:</strong> {servidor.nombre}</p>
                    <p><strong>Descripción:</strong> {servidor.descripcion}</p>
                    <p><strong>Proyecto:</strong> {servidor.nombre_proyecto}</p>
                </div>
            )}
            <div className="modal-acciones">
                <button onClick={doDeshabilitarServidor}>Deshabilitar</button>
                <button onClick={() => cerrarModal(false)}>Cancelar</button>
            </div>
        </OverlayCarga>
    </Modal>
}