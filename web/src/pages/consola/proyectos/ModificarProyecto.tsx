import { useState, useEffect } from "react";
import { Modal } from "@/components/modal";
import { modificarProyecto } from "@/api/proyectos";
import type { IProyecto } from "@/interfaces/proyectos";
import { toast } from "@/common/toast";
import { OverlayCarga } from "@/components/overlay-carga";

type Props = {
    modalAbierto: boolean;
    cerrarModal: (recargar: boolean) => void;
    proyecto?: IProyecto;
}

export function ModificarProyectoModal({ modalAbierto, cerrarModal, proyecto }: Props) {
    const [cargando, setCargando] = useState(false);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");

    function doModificarProyecto(e: React.FormEvent) {
        e.preventDefault();
        if (!proyecto) return;
        console.log("Modificar proyecto");
        setCargando(true);
        modificarProyecto(proyecto.id, nombre, descripcion)
            .then((response) => {
                console.log("Proyecto modificado:", response.data);
                toast.success("Proyecto modificado", "El proyecto ha sido modificado correctamente.");
                cerrarModal(true);
            })
            .catch((error) => {
                console.error("Error al modificar el proyecto:", error);
                if (error.status === 422) {
                    toast.warning("Error al modificar proyecto", error.response.data.mensaje);
                }else{
                    toast.error("Error al modificar proyecto", "Ha ocurrido un error al modificar el proyecto.");
                }
            })
            .finally(() => {
                setCargando(false);
            });
    }

    useEffect(() => {
        // Cuando se abra el modal, cargar los datos del usuario a modificar
        if (!proyecto) return;
        setNombre(proyecto.nombre);
        setDescripcion(proyecto.descripcion);
    }, [proyecto]);

    return <Modal
        modalAbierto={modalAbierto}
        cerrarModal={() => cerrarModal(false)}
        titulo="Modificar Proyecto"
        deshabilitarCerrar={cargando}
    >
        <OverlayCarga cargando={cargando}>
            <form onSubmit={doModificarProyecto}>
                <div>
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="descripcion">Descripción:</label>
                    <input
                        type="text"
                        name="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />
                </div>
                <div className="modal-acciones">
                    <button type="submit">Guardar</button>
                    <button onClick={() => cerrarModal(false)}>Cancelar</button>
                </div>
            </form>
        </OverlayCarga>
    </Modal>
}
