import { useState } from "react";
import { Modal } from "@/components/modal";

type Props = {
    modalAbierto: boolean;
    cerrarModal: () => void;
}

export function AgregarUsuarioModal({ modalAbierto, cerrarModal }: Props) {
    const [correo, setCorreo] = useState("");
    const [nombre, setNombre] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [rol, setRol] = useState("OPERADOR");

    return <Modal
        modalAbierto={modalAbierto}
        cerrarModal={cerrarModal}
        titulo="Agregar Usuario"
    >
        <form>
            <div>
                <label htmlFor="correo">Correo:</label>
                <input
                    type="email"
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
            <button type="submit">Agregar</button>
        </form>
    </Modal>
}
