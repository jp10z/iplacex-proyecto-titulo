import { useState, useEffect } from "react";
import type { IUsuario } from "../../../interfaces/usuarios";
import { obtenerUsuarios } from "../../../api/usuarios";

export function UsuariosPage() {
    const [buscarValue, setBuscarValue] = useState("");
    const [usuarios, setUsuarios] = useState<IUsuario[]>([]);

    function cargarUsuarios() {
        obtenerUsuarios()
            .then((response) => {
                setUsuarios(response.data.datos);
            })
            .catch((error) => {
                console.error("Error al obtener los usuarios:", error);
            });
    }

    useEffect(() => {
        cargarUsuarios();
    }, []);

    return (
        <>
            <h1>Página de usuarios</h1>
            <div>
                <button>Agregar usuario</button>
                <input 
                    type="text" placeholder="Buscar..."
                    value={buscarValue}
                    onChange={(e) => setBuscarValue(e.target.value)}
                />
            </div>
            {usuarios.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Correo</th>
                            <th>Nombre</th>
                            <th>Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>{usuario.correo}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.rol}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>No hay usuarios disponibles.</div>
            )}
        </>
    );
}