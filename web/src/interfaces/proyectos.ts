export interface IProyecto {
    id: number;
    nombre: string;
    descripcion: string;
    servidores: number;
}

export interface IProyectosResponse {
    items: IProyecto[];
    total: number;
}