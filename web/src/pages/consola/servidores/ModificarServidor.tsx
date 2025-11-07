import { useState, useEffect } from "react";
import { Modal } from "@/components/modal";
import { modificarServidor } from "@/api/servidores";
import type { IServidor } from "@/interfaces/servidores";
import type { IProyectoListaItem } from "@/interfaces/proyectos";
import { toast } from "@/common/toast";
import { OverlayCarga } from "@/components/overlay-carga";

type Props = {
    modalAbierto: boolean;
    cerrarModal: (recargar: boolean) => void;
    servidor?: IServidor;
    listaProyectos: IProyectoListaItem[];
}

export function ModificarServidorModal({ modalAbierto, cerrarModal, servidor, listaProyectos }: Props) {
    const [cargando, setCargando] = useState(false);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [idProyecto, setIdProyecto] = useState<number | null>(null);

    function doModificarServidor(e: React.FormEvent) {
        e.preventDefault();
        if (!servidor) return;
        if (idProyecto === null) {
            toast.warning("Error al guardar el servidor", "Debe seleccionar un proyecto.");
            return;
        }
        console.log("Modificar servidor");
        setCargando(true);
        modificarServidor(servidor.id, nombre, descripcion, idProyecto)
            .then((response) => {
                console.log("Servidor modificado:", response.data);
                toast.success("Servidor modificado", "El servidor ha sido modificado correctamente.");
                cerrarModal(true);
            })
            .catch((error) => {
                console.error("Error al modificar el servidor:", error);
                if (error.status === 422) {
                    toast.warning("Error al modificar servidor", error.response.data.mensaje);
                }else{
                    toast.error("Error al modificar servidor", "Ha ocurrido un error al modificar el servidor.");
                }
            })
            .finally(() => {
                setCargando(false);
            });
    }

    useEffect(() => {
        // Cuando se abra el modal, cargar los datos del servidor a modificar
        if (!servidor) return;
        setNombre(servidor.nombre);
        setDescripcion(servidor.descripcion);
        setIdProyecto(servidor.id_proyecto);
    }, [servidor]);

    return <Modal
        modalAbierto={modalAbierto}
        cerrarModal={() => cerrarModal(false)}
        titulo="Modificar Servidor"
        deshabilitarCerrar={cargando}
    >
        <OverlayCarga cargando={cargando}>
            <form onSubmit={doModificarServidor}>
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
                    <button type="submit">Guardar</button>
                    <button onClick={() => cerrarModal(false)}>Cancelar</button>
                </div>
            </form>
        </OverlayCarga>
    </Modal>
}
