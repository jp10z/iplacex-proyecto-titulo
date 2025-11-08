import axios from "axios";
import type { IDashboardEstadosResponse } from "@/interfaces/dashboard";

const BASE_URL = "http://localhost:5000/api";

export async function obtenerEstadosServidores(idProyecto: number) {
    return await axios.get<IDashboardEstadosResponse>(`${BASE_URL}/dashboard/estados/${idProyecto}`);
}

export async function agregarAccesoServidor(idServidor: number, idUsuario: number, duracionMinutos: number, notas: string) {
    const payload = {
        id_servidor: idServidor,
        id_usuario: idUsuario,
        duracion_minutos: duracionMinutos,
        notas: notas
    }
    return await axios.post(`${BASE_URL}/dashboard/acceso`, payload);
}