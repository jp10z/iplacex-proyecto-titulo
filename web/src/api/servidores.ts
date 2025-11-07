import axios from "axios";
import type { IServidoresResponse } from "@/interfaces/servidores";

const BASE_URL = "http://localhost:5000/api";

export async function obtenerServidores(paginaIndex: number, paginaSize: number, textoBusqueda: string) {
    return await axios.get<IServidoresResponse>(`${BASE_URL}/servidores?buscar=${textoBusqueda}&paginaIndex=${paginaIndex}&paginaSize=${paginaSize}`);
}

export async function agregarServidor(nombre: string, descripcion: string, idProyecto: number) {
    const payload = {
        nombre: nombre,
        descripcion: descripcion,
        id_proyecto: idProyecto
    }
    return await axios.post(`${BASE_URL}/servidores`, payload);
}

export async function modificarServidor(id: number, nombre: string, descripcion: string, idProyecto: number) {
    const payload: any = {
        nombre: nombre,
        descripcion: descripcion,
        id_proyecto: idProyecto
    }
    return await axios.put(`${BASE_URL}/servidores/${id}`, payload);
}

export async function deshabilitarServidor(id: number) {
    return await axios.delete(`${BASE_URL}/servidores/${id}`);
}