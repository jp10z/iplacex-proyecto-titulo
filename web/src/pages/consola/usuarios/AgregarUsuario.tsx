import { useState, useEffect } from "react";
import { Modal } from "@/components/modal";
import { agregarUsuario } from "@/api/usuarios";
import { obtenerListaProyectos } from "@/api/proyectos";
import { toast } from "@/common/toast";
import { OverlayCarga } from "@/components/overlay-carga";
import { MultiSelect } from "@/components/multiselect";

type Props = {
    modalAbierto: boolean;
    cerrarModal: (recargar: boolean) => void;
}

export function AgregarUsuarioModal({ modalAbierto, cerrarModal }: Props) {
    const [cargando, setCargando] = useState(false);
    const [correo, setCorreo] = useState("");
    const [nombre, setNombre] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [rol, setRol] = useState("OPERADOR");
    const [proyectosDisponibles, setProyectosDisponibles] = useState<{valor: string | number, etiqueta: string}[]>([]);
    const [proyectosSeleccionados, setProyectosSeleccionados] = useState<(string | number)[]>([]);

    function doAgregarUsuario(e: React.FormEvent) {
        e.preventDefault();
        console.log("Agregar usuario");
        setCargando(true);
        agregarUsuario(correo, nombre, contrasenia, rol, proyectosSeleccionados)
            .then((response) => {
                console.log("Usuario agregado:", response.data);
                toast.success("Usuario agregado", "El usuario ha sido agregado correctamente.");
                cerrarModal(true);
            })
            .catch((error) => {
                console.error("Error al agregar el usuario:", error);
                if (error.status === 422) {
                    toast.warning("Error al agregar usuario", error.response.data.mensaje);
                }else{
                    toast.error("Error al agregar usuario", "Ha ocurrido un error al agregar el usuario.");
                }
            })
            .finally(() => {
                setCargando(false);
            });
    }

    function cargarListaProyectos() {
        obtenerListaProyectos()
            .then((response) => {
                const proyectos = response.data.items.map((proyecto) => ({
                    valor: proyecto.id_proyecto,
                    etiqueta: proyecto.nombre,
                }));
                setProyectosDisponibles(proyectos);
            }
            )
            .catch((error) => {
                console.error("Error al obtener la lista de proyectos:", error);
            });
    }

    useEffect(() => {
        // Resetear los datos del formulario cuando se cierre el modal
        if (!modalAbierto) {
            setCorreo("");
            setNombre("");
            setContrasenia("");
            setRol("OPERADOR");
            setProyectosSeleccionados([]);
        } else {
            cargarListaProyectos();
        }
        console.log(proyectosSeleccionados)
    }, [modalAbierto]);

    return <Modal
        modalAbierto={modalAbierto}
        cerrarModal={() => cerrarModal(false)}
        titulo="Agregar Usuario"
        deshabilitarCerrar={cargando}
    >
        <OverlayCarga cargando={cargando}>
            
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
                <div>
                    <label>Proyectos:</label>
                    <MultiSelect
                        opciones={proyectosDisponibles}
                        seleccionados={proyectosSeleccionados}  
                        setSeleccionados={setProyectosSeleccionados}
                    />
                </div>
                <div className="modal-acciones">
                    <button className="azul" type="submit">Agregar</button>
                    <button onClick={() => cerrarModal(false)}>Cancelar</button>
                </div>
            </form>
        </OverlayCarga>
    </Modal>
}
