import axios from "axios";
import type { IDashboardEstadosResponse, IServidorEstadoDetallesResponse } from "@/interfaces/dashboard";
import type { IProyectosListaResponse } from "@/interfaces/proyectos";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function obtenerEstadosServidores(idProyecto: number) {
    return await axios.get<IDashboardEstadosResponse>(`${API_URL}/dashboard/estados/${idProyecto}`);
}

export async function agregarAccesoServidor(idServidor: number, duracionMinutos: number, notas: string) {
    const payload = {
        id_servidor: idServidor,
        duracion_minutos: duracionMinutos,
        notas: notas
    }
    return await axios.post(`${API_URL}/dashboard/acceso`, payload);
}

export async function obtenerDetallesAccesoServidor(idServidor: number) {
    return await axios.get<IServidorEstadoDetallesResponse>(`${API_URL}/dashboard/detalles/${idServidor}`);
}

export async function obtenerListaProyectosUsuario() {
    return await axios.get<IProyectosListaResponse>(`${API_URL}/dashboard/proyectos`);
}