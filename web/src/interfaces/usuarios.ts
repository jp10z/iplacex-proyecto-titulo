export interface IUsuario {
    id: number;
    correo: string;
    nombre: string;
    rol: string;
    estado: string;
}

export interface IUsuariosResponse {
    datos: IUsuario[];
    total: number;
}