import { useState, useEffect } from "react";
import { Modal } from "@/components/modal";
import { agregarServidor } from "@/api/servidores";
import { toast } from "@/common/toast";
import { OverlayCarga } from "@/components/overlay-carga";
import type { IProyectoListaItem } from "@/interfaces/proyectos";

type Props = {
    modalAbierto: boolean;
    cerrarModal: (recargar: boolean) => void;
    listaProyectos: IProyectoListaItem[];
}

export function AgregarServidorModal({ modalAbierto, cerrarModal, listaProyectos }: Props) {
    const [cargando, setCargando] = useState(false);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [idProyecto, setIdProyecto] = useState<number | null>(null);

    function doAgregarServidor(e: React.FormEvent) {
        e.preventDefault();
        if (idProyecto === null) {
            toast.warning("Error al guardar el servidor", "Debe seleccionar un proyecto.");
            return;
        }
        console.log("Agregar servidor");
        setCargando(true);
        agregarServidor(nombre, descripcion , idProyecto)
            .then((response) => {
                console.log("Servidor agregado:", response.data);
                toast.success("Servidor agregado", "El servidor ha sido agregado correctamente.");
                cerrarModal(true);
            })
            .catch((error) => {
                console.error("Error al agregar el servidor:", error);
                if (error.status === 422) {
                    toast.warning("Error al agregar servidor", error.response.data.mensaje);
                }else{
                    toast.error("Error al agregar servidor", "Ha ocurrido un error al agregar el servidor.");
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
            setIdProyecto(null);
        }
    }, [modalAbierto]);

    return <Modal
        modalAbierto={modalAbierto}
        cerrarModal={() => cerrarModal(false)}
        titulo="Agregar servidor"
        deshabilitarCerrar={cargando}
    >
        <OverlayCarga cargando={cargando}>
            <form onSubmit={doAgregarServidor}>
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
                <div>
                    <label htmlFor="proyecto">Proyecto:</label>
                    <select
                        name="proyecto"
                        value={idProyecto ?? ""}
                        onChange={(e) => {
                            const valor = e.target.value;
                            if (valor === "") {
                                setIdProyecto(null);
                            } else {
                                setIdProyecto(Number(valor));
                            }
                        }}
                        required
                    >
                        <option value="">-- Seleccione un proyecto --</option>
                        {listaProyectos.map((proyecto) => (
                            <option key={proyecto.id_proyecto} value={proyecto.id_proyecto}>
                                {proyecto.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="modal-acciones">
                    <button type="submit">Agregar</button>
                    <button onClick={() => cerrarModal(false)}>Cancelar</button>
                </div>
            </form>
        </OverlayCarga>
    </Modal>
}
