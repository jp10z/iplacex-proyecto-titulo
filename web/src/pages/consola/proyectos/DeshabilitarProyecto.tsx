import { useState } from "react";
import { Modal } from "@/components/modal";
import type { IProyecto } from "@/interfaces/proyectos";
import { deshabilitarProyecto } from "@/api/proyectos";
import { toast } from "@/common/toast";
import { OverlayCarga } from "@/components/overlay-carga";

type Props = {
    modalAbierto: boolean;
    cerrarModal: (recargar: boolean) => void;
    proyecto?: IProyecto;
};

export function DeshabilitarProyectoModal({ modalAbierto, cerrarModal, proyecto }: Props) {
    const [cargando, setCargando] = useState(false);
    function doDeshabilitarProyecto() {
        if (!proyecto) {
            return;
        }
        setCargando(true);
        deshabilitarProyecto(proyecto.id)
            .then((response) => {
                console.log("Proyecto deshabilitado:", response.data);
                toast.success("Proyecto deshabilitado", "El proyecto ha sido deshabilitado correctamente.");
                cerrarModal(true);
            })
            .catch((error) => {
                console.error("Error al deshabilitar el proyecto:", error);
            })
            .finally(() => {
                setCargando(false);
            });
    }

    return <Modal
        modalAbierto={modalAbierto}
        cerrarModal={() => cerrarModal(false)}
        titulo="Deshabilitar Proyecto"
        deshabilitarCerrar={cargando}
    >
        <OverlayCarga cargando={cargando}>
            <p>¿Estás seguro de que deseas deshabilitar el siguiente proyecto?</p>
            {proyecto && (
                <div style={{ marginTop: "12px" }}>
                    <p><strong>Nombre:</strong> {proyecto.nombre}</p>
                    <p><strong>Descripción:</strong> {proyecto.descripcion}</p>
                </div>
            )}
            <div className="modal-acciones">
                <button className="rojo" onClick={doDeshabilitarProyecto}>Deshabilitar</button>
                <button onClick={() => cerrarModal(false)}>Cancelar</button>
            </div>
        </OverlayCarga>
    </Modal>
}