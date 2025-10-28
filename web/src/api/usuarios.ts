import axios from "axios";
import type { IUsuariosResponse } from "@/interfaces/usuarios";

const BASE_URL = "http://localhost:5000/api";

export async function obtenerUsuarios(paginaIndex: number, paginaSize: number, textoBusqueda: string) {
    return await axios.get<IUsuariosResponse>(`${BASE_URL}/usuarios?buscar=${textoBusqueda}&paginaIndex=${paginaIndex}&paginaSize=${paginaSize}`);
}

export async function agregarUsuario(correo: string, nombre: string, contrasenia: string, rol: string) {
    const payload = {
        correo: correo,
        nombre: nombre,
        contrasenia: contrasenia,
        rol: rol
    }
    return await axios.post(`${BASE_URL}/usuarios`, payload);
}

export async function modificarUsuario(id: number, correo: string, nombre: string, contrasenia: string, rol: string) {
    const payload: any = {
        correo: correo,
        nombre: nombre,
        rol: rol
    }
    if (contrasenia && contrasenia.trim() !== "") {
        payload.contrasenia = contrasenia;
    }
    return await axios.put(`${BASE_URL}/usuarios/${id}`, payload);
}

export async function deshabilitarUsuario(id: number) {
    return await axios.delete(`${BASE_URL}/usuarios/${id}`);
}