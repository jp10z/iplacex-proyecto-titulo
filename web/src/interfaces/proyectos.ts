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

export interface IProyectoListaItem {
    id_proyecto: number;
    nombre: string;
}

export interface IProyectosListaResponse {
    items: IProyectoListaItem[];
}