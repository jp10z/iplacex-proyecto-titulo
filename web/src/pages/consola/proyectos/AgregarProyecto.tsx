import { useState, useEffect } from "react";
import { Modal } from "@/components/modal";
import { agregarProyecto } from "@/api/proyectos";
import { toast } from "@/common/toast";
import { OverlayCarga } from "@/components/overlay-carga";

type Props = {
    modalAbierto: boolean;
    cerrarModal: (recargar: boolean) => void;
}

export function AgregarProyectoModal({ modalAbierto, cerrarModal }: Props) {
    const [cargando, setCargando] = useState(false);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");

    function doAgregarProyecto(e: React.FormEvent) {
        e.preventDefault();
        console.log("Agregar proyecto");
        setCargando(true);
        agregarProyecto(nombre, descripcion)
            .then((response) => {
                console.log("Proyecto agregado:", response.data);
                toast.success("Proyecto agregado", "El proyecto ha sido agregado correctamente.");
                cerrarModal(true);
            })
            .catch((error) => {
                console.error("Error al agregar el proyecto:", error);
                if (error.status === 422) {
                    toast.warning("Error al agregar proyecto", error.response.data.mensaje);
                }else{
                    toast.error("Error al agregar proyecto", "Ha ocurrido un error al agregar el proyecto.");
                }
            })
            .finally(() => {
                setCargando(false);
            });
    }

    useEffect(() => {
        // Resetear los datos del formulario cuando se cierre el modal
        if (!modalAbierto) {
            setNombre("");
            setDescripcion("");
        }
    }, [modalAbierto]);

    return <Modal
        modalAbierto={modalAbierto}
        cerrarModal={() => cerrarModal(false)}
        titulo="Agregar Proyecto"
        deshabilitarCerrar={cargando}
    >
        <OverlayCarga cargando={cargando}>
            <form onSubmit={doAgregarProyecto}>
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
                    <button className="azul" type="submit">Agregar</button>
                    <button onClick={() => cerrarModal(false)}>Cancelar</button>
                </div>
            </form>
        </OverlayCarga>
    </Modal>
}
