import axios from "axios";
import type { IDatosSesion } from "@/interfaces/auth";

const BASE_URL = "http://localhost:5000/api";

export async function login(correo: string, contrasenia: string) {
    const payload = {
        correo: correo,
        contrasenia: contrasenia
    }
    return await axios.post(`${BASE_URL}/auth/login`, payload);
}

export async function obtenerDatosSesion(signal?: AbortSignal) {
    return await axios.get<IDatosSesion>(`${BASE_URL}/auth/datos`, { signal });
}

export async function logout() {
    return await axios.post(`${BASE_URL}/auth/logout`);
}