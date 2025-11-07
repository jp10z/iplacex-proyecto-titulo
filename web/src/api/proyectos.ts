import axios from "axios";
import type { IProyectosResponse, IProyectosListaResponse } from "@/interfaces/proyectos";

const BASE_URL = "http://localhost:5000/api";

export async function obtenerProyectos(paginaIndex: number, paginaSize: number, textoBusqueda: string) {
    return await axios.get<IProyectosResponse>(`${BASE_URL}/proyectos?buscar=${textoBusqueda}&paginaIndex=${paginaIndex}&paginaSize=${paginaSize}`);
}

export async function agregarProyecto(nombre: string, descripcion: string) {
    const payload = {
        nombre: nombre,
        descripcion: descripcion
    }
    return await axios.post(`${BASE_URL}/proyectos`, payload);
}

export async function modificarProyecto(id: number, nombre: string, descripcion: string) {
    const payload: any = {
        nombre: nombre,
        descripcion: descripcion
    }
    return await axios.put(`${BASE_URL}/proyectos/${id}`, payload);
}

export async function deshabilitarProyecto(id: number) {
    return await axios.delete(`${BASE_URL}/proyectos/${id}`);
}

export async function obtenerListaProyectos() {
    return await axios.get<IProyectosListaResponse>(`${BASE_URL}/proyectos/lista`);
}