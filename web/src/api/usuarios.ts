import axios from "axios";
import type { IUsuariosResponse } from "../interfaces/usuarios";

const BASE_URL = "http://localhost:5000/api";

export async function obtenerUsuarios() {
    return await axios.get<IUsuariosResponse>(`${BASE_URL}/usuarios`);
}
