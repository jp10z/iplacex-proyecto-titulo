import axios from "axios";
import type { IEventosResponse, IEventoDatosResponse } from "@/interfaces/eventos";

const BASE_URL = "http://localhost:5000/api";

export async function obtenerEventos(paginaIndex: number, paginaSize: number, textoBusqueda: string, fechaDesde?: string, fechaHasta?: string, idTipoEvento?: number, idUsuario?: number, idServidor?: number) {
    return await axios.get<IEventosResponse>(`${BASE_URL}/eventos?buscar=${textoBusqueda}&paginaIndex=${paginaIndex}&paginaSize=${paginaSize}&idTipoEvento=${idTipoEvento || ""}&idUsuario=${idUsuario || ""}&idServidor=${idServidor || ""}&fechaDesde=${fechaDesde || ""}&fechaHasta=${fechaHasta || ""}`);
}

export async function obtenerDatosEvento(idEvento: number) {
    return await axios.get<IEventoDatosResponse>(`${BASE_URL}/eventos/${idEvento}`);
}