import { useState, useEffect } from "react";
import { Modal } from "@/components/modal";
import { agregarUsuario } from "@/api/usuarios";
import { toast } from "@/common/toast";

type Props = {
    modalAbierto: boolean;
    cerrarModal: (recargar: boolean) => void;
}

export function AgregarUsuarioModal({ modalAbierto, cerrarModal }: Props) {
    const [correo, setCorreo] = useState("");
    const [nombre, setNombre] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [rol, setRol] = useState("OPERADOR");

    function doAgregarUsuario(e: React.FormEvent) {
        e.preventDefault();
        console.log("Agregar usuario");
        agregarUsuario(correo, nombre, contrasenia, rol)
            .then((response) => {
                console.log("Usuario agregado:", response.data);
                toast.success("Usuario agregado", "El usuario ha sido agregado correctamente.");
                cerrarModal(true);
            })
            .catch((error) => {
                console.error("Error al agregar el usuario:", error);
            });
    }

    useEffect(() => {
        // Resetear los datos del formulario cuando se cierre el modal
        if (!modalAbierto) {
            setCorreo("");
            setNombre("");
            setContrasenia("");
            setRol("OPERADOR");
        }
    }, [modalAbierto]);

    return <Modal
        modalAbierto={modalAbierto}
        cerrarModal={() => cerrarModal(false)}
        titulo="Agregar Usuario"
    >
        <form onSubmit={doAgregarUsuario}>
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
                    value={contrasenia}
                    onChange={(e) => setContrasenia(e.target.value)}
                    required
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
                <button type="submit">Agregar</button>
            </div>
        </form>
    </Modal>
}
