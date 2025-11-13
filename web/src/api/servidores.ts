import axios from "axios";
import type { IServidoresResponse } from "@/interfaces/servidores";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function obtenerServidores(paginaIndex: number, paginaSize: number, textoBusqueda: string, idProyecto?: number) {
    return await axios.get<IServidoresResponse>(`${API_URL}/servidores?buscar=${textoBusqueda}&paginaIndex=${paginaIndex}&paginaSize=${paginaSize}&idProyecto=${idProyecto || ""}`);
}

export async function agregarServidor(nombre: string, descripcion: string, idProyecto: number) {
    const payload = {
        nombre: nombre,
        descripcion: descripcion,
        id_proyecto: idProyecto
    }
    return await axios.post(`${API_URL}/servidores`, payload);
}

export async function modificarServidor(id: number, nombre: string, descripcion: string, idProyecto: number) {
    const payload: any = {
        nombre: nombre,
        descripcion: descripcion,
        id_proyecto: idProyecto
    }
    return await axios.put(`${API_URL}/servidores/${id}`, payload);
}

export async function deshabilitarServidor(id: number) {
    return await axios.delete(`${API_URL}/servidores/${id}`);
}