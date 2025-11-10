import axios from "axios";
import type { IDashboardEstadosResponse, IServidorEstadoDetallesResponse } from "@/interfaces/dashboard";
import type { IProyectosListaResponse } from "@/interfaces/proyectos";

const BASE_URL = "http://localhost:5000/api";

export async function obtenerEstadosServidores(idProyecto: number) {
    return await axios.get<IDashboardEstadosResponse>(`${BASE_URL}/dashboard/estados/${idProyecto}`);
}

export async function agregarAccesoServidor(idServidor: number, duracionMinutos: number, notas: string) {
    const payload = {
        id_servidor: idServidor,
        duracion_minutos: duracionMinutos,
        notas: notas
    }
    return await axios.post(`${BASE_URL}/dashboard/acceso`, payload);
}

export async function obtenerDetallesAccesoServidor(idServidor: number) {
    return await axios.get<IServidorEstadoDetallesResponse>(`${BASE_URL}/dashboard/detalles/${idServidor}`);
}

export async function obtenerListaProyectosUsuario() {
    return await axios.get<IProyectosListaResponse>(`${BASE_URL}/dashboard/proyectos`);
}