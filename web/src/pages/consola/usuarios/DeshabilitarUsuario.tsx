import { useState } from "react";
import { Modal } from "@/components/modal";
import type { IUsuario } from "@/interfaces/usuarios";
import { deshabilitarUsuario } from "@/api/usuarios";
import { toast } from "@/common/toast";
import { OverlayCarga } from "@/components/overlay-carga";

type Props = {
    modalAbierto: boolean;
    cerrarModal: (recargar: boolean) => void;
    usuario?: IUsuario;
};

export function DeshabilitarUsuarioModal({ modalAbierto, cerrarModal, usuario }: Props) {
    const [cargando, setCargando] = useState(false);
    function doDeshabilitarUsuario() {
        if (!usuario) {
            return;
        }
        setCargando(true);
        deshabilitarUsuario(usuario.id)
            .then((response) => {
                console.log("Usuario deshabilitado:", response.data);
                toast.success("Usuario deshabilitado", "El usuario ha sido deshabilitado correctamente.");
                cerrarModal(true);
            })
            .catch((error) => {
                console.error("Error al deshabilitar el usuario:", error);
            })
            .finally(() => {
                setCargando(false);
            });
    }

    return <Modal
        modalAbierto={modalAbierto}
        cerrarModal={() => cerrarModal(false)}
        titulo="Deshabilitar Usuario"
        deshabilitarCerrar={cargando}
    >
        <OverlayCarga cargando={cargando}>
            <p>¿Estás seguro de que deseas deshabilitar al siguiente usuario?</p>
            {usuario && (
                <div style={{ marginTop: "12px" }}>
                    <p><strong>Correo:</strong> {usuario.correo}</p>
                    <p><strong>Nombre:</strong> {usuario.nombre}</p>
                </div>
            )}
            <div className="modal-acciones">
                <button className="rojo" onClick={doDeshabilitarUsuario}>Deshabilitar</button>
                <button onClick={() => cerrarModal(false)}>Cancelar</button>
            </div>
        </OverlayCarga>
    </Modal>
}