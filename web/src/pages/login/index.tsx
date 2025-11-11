import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OverlayCarga } from "@/components/overlay-carga";
import { login } from "@/api/auth";
import { toast } from "@/common/toast";
import { useSesion } from "@/context/SesionContext";

export function LoginPage() {
    const { autenticado, fetchingDatosSesion, refreshDatosSesion } = useSesion();
    const [cargando, setCargando] = useState(false);
    const [correo, setCorreo] = useState("");
    const [contrasenia, setContrasenia] = useState("");

    const navigate = useNavigate();

    if (fetchingDatosSesion) {
        return <div>Validando sesión...</div>;
    }

    if (autenticado) {
        navigate("/consola");
        return null;
    }

    function doLogin(e: React.FormEvent) {
        e.preventDefault();
        console.log("Iniciar sesión");
        setCargando(true);
        login(correo, contrasenia)
            .then(async () => {
                console.log("Inicio de sesión exitoso");
                await refreshDatosSesion();
                toast.success("Inicio de sesión exitoso", "Has iniciado sesión correctamente.");
                navigate("/consola");
            })
            .catch((error) => {
                console.error("Error al iniciar sesión:", error);
                if (error.status === 401) {
                    toast.warning("Error al iniciar sesión", "Correo o contraseña incorrectos.");
                }else{
                    toast.error("Error al iniciar sesión", "Ha ocurrido un error al iniciar sesión.");
                }
            })
            .finally(() => {
                setCargando(false);
            });
    }

    return <>
        <div className="contenedor-login">
            <h1>Sistema de gestión de reservas de servidores</h1>
            <OverlayCarga cargando={cargando}>
                <form onSubmit={doLogin}>
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
                        <label htmlFor="contrasenia">Contraseña:</label>
                        <input
                            type="password"
                            name="contrasenia"
                            value={contrasenia}
                            onChange={(e) => setContrasenia(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{marginTop: "8px"}}>
                        <button className="azul" type="submit">Ingresar</button>
                    </div>
                </form>
            </OverlayCarga>
        </div>
    </>;
}