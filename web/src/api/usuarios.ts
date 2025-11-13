import axios from "axios";
import type { IUsuariosResponse } from "@/interfaces/usuarios";
import type { IProyectosListaResponse } from "@/interfaces/proyectos";

const API_URL = import.meta.env.VITE_API_URL;

export async function obtenerUsuarios(paginaIndex: number, paginaSize: number, textoBusqueda: string) {
    return await axios.get<IUsuariosResponse>(`${API_URL}/usuarios?buscar=${textoBusqueda}&paginaIndex=${paginaIndex}&paginaSize=${paginaSize}`);
}

export async function agregarUsuario(correo: string, nombre: string, contrasenia: string, rol: string, proyectos: (string | number)[]) {
    const payload = {
        correo: correo,
        nombre: nombre,
        contrasenia: contrasenia,
        rol: rol, 
        proyectos: proyectos
    }
    return await axios.post(`${API_URL}/usuarios`, payload);
}

export async function modificarUsuario(id: number, correo: string, nombre: string, contrasenia: string, rol: string, proyectos: (string | number)[]) {
    const payload: any = {
        correo: correo,
        nombre: nombre,
        rol: rol,
        proyectos: proyectos
    }
    if (contrasenia && contrasenia.trim() !== "") {
        payload.contrasenia = contrasenia;
    }
    return await axios.put(`${API_URL}/usuarios/${id}`, payload);
}

export async function deshabilitarUsuario(id: number) {
    return await axios.delete(`${API_URL}/usuarios/${id}`);
}

export async function obtenerListaProyectosUsuario(idUsuario: number) {
    return await axios.get<IProyectosListaResponse>(`${API_URL}/usuarios/proyectos/${idUsuario}`);
}