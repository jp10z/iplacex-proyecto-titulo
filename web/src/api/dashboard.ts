import axios from "axios";
import type { IDashboardEstadosResponse } from "@/interfaces/dashboard";

const BASE_URL = "http://localhost:5000/api";

export async function obtenerEstadosServidores(idProyecto: number) {
    return await axios.get<IDashboardEstadosResponse>(`${BASE_URL}/dashboard/estados/${idProyecto}`);
}