import { Modal } from "@/components/modal";
import type { IUsuario } from "@/interfaces/usuarios";
import { deshabilitarUsuario } from "@/api/usuarios";

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
            <div>
                <p><strong>Correo:</strong> {usuario.correo}</p>
                <p><strong>Nombre:</strong> {usuario.nombre}</p>
            </div>
        )}
        <button onClick={doDeshabilitarUsuario}>Deshabilitar</button>
        <button onClick={() => cerrarModal(false)}>Cancelar</button>
    </Modal>
}