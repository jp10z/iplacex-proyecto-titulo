import { useState, useEffect } from "react";
import { Modal } from "@/components/modal";
import { agregarAccesoServidor } from "@/api/dashboard";
import { toast } from "@/common/toast";
import { OverlayCarga } from "@/components/overlay-carga";
import type { IServidorEstado } from "@/interfaces/dashboard";

type Props = {
    modalAbierto: boolean;
    cerrarModal: (recargar: boolean) => void;
    servidor?: IServidorEstado;
}

export function AgregarAccesoModal({ modalAbierto, cerrarModal, servidor }: Props) {
    const [cargando, setCargando] = useState(false);
    const [duracionMinutos, setDuracionMinutos] = useState(0);
    const [notas, setNotas] = useState("");

    function doAgregarAcceso(e: React.FormEvent) {
        e.preventDefault();
        console.log("Agregar acceso dep", {
            duracionMinutos, notas, servidor
        });
        if (servidor === undefined || servidor.id === undefined) return;
        console.log("Agregar acceso");
        setCargando(true);
        agregarAccesoServidor(servidor?.id, duracionMinutos, notas)
            .then((response) => {
                console.log("Acceso agregado:", response.data);
                toast.success("Acceso agregado", "El acceso ha sido agregado correctamente.");
                cerrarModal(true);
            })
            .catch((error) => {
                console.error("Error al agregar el acceso:", error);
                if (error.status === 422) {
                    toast.warning("Error al agregar acceso", error.response.data.mensaje);
                }else{
                    toast.error("Error al agregar acceso", "Ha ocurrido un error al agregar el acceso.");
                }
            })
            .finally(() => {
                setCargando(false);
            });
    }

    useEffect(() => {
        // Resetear los datos del formulario cuando se cierre el modal
        if (!modalAbierto) {
            setDuracionMinutos(15);
            setNotas("");
        }
    }, [modalAbierto]);

    return <Modal
        modalAbierto={modalAbierto}
        cerrarModal={() => cerrarModal(false)}
        titulo="Reservar acceso"
        deshabilitarCerrar={cargando}
    >
        <OverlayCarga cargando={cargando}>
            <form onSubmit={doAgregarAcceso}>
                <div>
                    <label htmlFor="duracionMinutos">Duración (minutos):</label>
                    <input
                        type="number"
                        name="duracionMinutos"
                        value={duracionMinutos}
                        onChange={(e) => setDuracionMinutos(Number(e.target.value))}
                        required
                        min={1}
                        max={1440}
                    />
                </div>
                <div>
                    <label htmlFor="notas">Notas:</label>
                    <textarea
                        name="notas"
                        style={{ minWidth: "100%", maxWidth: "100%", minHeight: "80px" }}
                        rows={4}
                        value={notas}
                        onChange={(e) => setNotas(e.target.value)}
                    />
                </div>
                <div className="modal-acciones">
                    <button className="azul" type="submit">Reservar ahora</button>
                    <button onClick={() => cerrarModal(false)}>Cancelar</button>
                </div>
            </form>
        </OverlayCarga>
    </Modal>
}
