import axios from "axios";
import type { IDatosSesion } from "@/interfaces/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function login(correo: string, contrasenia: string) {
    const payload = {
        correo: correo,
        contrasenia: contrasenia
    }
    return await axios.post(`${API_URL}/auth/login`, payload);
}

export async function obtenerDatosSesion(signal?: AbortSignal) {
    console.log('API_URL:', API_URL);
    return await axios.get<IDatosSesion>(`${API_URL}/auth/datos`, { signal });
}

export async function logout() {
    return await axios.post(`${API_URL}/auth/logout`);
}