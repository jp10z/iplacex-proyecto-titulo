import { useState, useEffect } from "react";
import { Modal } from "@/components/modal";
import { modificarUsuario } from "@/api/usuarios";
import type { IUsuario } from "@/interfaces/usuarios";
import { toast } from "@/common/toast";
import { OverlayCarga } from "@/components/overlay-carga";

type Props = {
    modalAbierto: boolean;
    cerrarModal: (recargar: boolean) => void;
    usuario?: IUsuario;
}

export function ModificarUsuarioModal({ modalAbierto, cerrarModal, usuario }: Props) {
    const [cargando, setCargando] = useState(false);
    const [correo, setCorreo] = useState("");
    const [nombre, setNombre] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [rol, setRol] = useState("OPERADOR");

    function doModificarUsuario(e: React.FormEvent) {
        e.preventDefault();
        if (!usuario) return;
        console.log("Modificar usuario");
        setCargando(true);
        modificarUsuario(usuario.id, correo, nombre, contrasenia, rol)
            .then((response) => {
                console.log("Usuario modificado:", response.data);
                toast.success("Usuario modificado", "El usuario ha sido modificado correctamente.");
                cerrarModal(true);
            })
            .catch((error) => {
                console.error("Error al modificar el usuario:", error);
                if (error.status === 422) {
                    toast.warning("Error al modificar usuario", error.response.data.mensaje);
                }else{
                    toast.error("Error al modificar usuario", "Ha ocurrido un error al modificar el usuario.");
                }
            })
            .finally(() => {
                setCargando(false);
            });
    }

    useEffect(() => {
        // Cuando se abra el modal, cargar los datos del usuario a modificar
        if (!usuario) return;
        setCorreo(usuario.correo);
        setNombre(usuario.nombre);
        setContrasenia("");
        setRol(usuario.rol);
    }, [usuario]);

    return <Modal
        modalAbierto={modalAbierto}
        cerrarModal={() => cerrarModal(false)}
        titulo="Modificar Usuario"
        deshabilitarCerrar={cargando}
    >
        <OverlayCarga cargando={cargando}>
            <form onSubmit={doModificarUsuario}>
                <div>
                    <label htmlFor="correo">Correo:</label>
                    <input
                        type="email"
                        name="correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </div>
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
                    <label htmlFor="contrasenia">Contraseña:</label>
                    <input
                        type="password"
                        name="contrasenia"
                        placeholder="Dejar en blanco para no cambiar"
                        value={contrasenia}
                        onChange={(e) => setContrasenia(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="rol">Rol:</label>
                    <select
                        name="rol"
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        required
                    >
                        <option value="OPERADOR">Operador</option>
                        <option value="ADMIN">Administrador</option>
                    </select>
                </div>
                <div className="modal-acciones">
                    <button type="submit">Guardar</button>
                </div>
            </form>
        </OverlayCarga>
    </Modal>
}
