import { Modal } from "@/components/modal";
import type { IUsuario } from "@/interfaces/usuarios";
import { deshabilitarUsuario } from "@/api/usuarios";
import { toast } from "@/common/toast";

type Props = {
    modalAbierto: boolean;
    cerrarModal: (recargar: boolean) => void;
    usuario?: IUsuario;
};

export function DeshabilitarUsuarioModal({ modalAbierto, cerrarModal, usuario }: Props) {
    function doDeshabilitarUsuario() {
        if (!usuario) {
            return;
        }
        deshabilitarUsuario(usuario.id)
            .then((response) => {
                console.log("Usuario deshabilitado:", response.data);
                toast.success("Usuario deshabilitado", "El usuario ha sido deshabilitado correctamente.");
                cerrarModal(true);
            })
            .catch((error) => {
                console.error("Error al deshabilitar el usuario:", error);
            });
    }

    return <Modal
        modalAbierto={modalAbierto}
        cerrarModal={() => cerrarModal(false)}
        titulo="Deshabilitar Usuario"
    >
        <p>¿Estás seguro de que deseas deshabilitar al siguiente usuario?</p>
        {usuario && (
            <div style={{ marginTop: "12px" }}>
                <p><strong>Correo:</strong> {usuario.correo}</p>
                <p><strong>Nombre:</strong> {usuario.nombre}</p>
            </div>
        )}
        <div className="modal-acciones">
            <button onClick={doDeshabilitarUsuario}>Deshabilitar</button>
            <button onClick={() => cerrarModal(false)}>Cancelar</button>
        </div>
    </Modal>
}