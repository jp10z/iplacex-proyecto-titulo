export interface IServidor {
    id: number;
    nombre: string;
    descripcion: string;
    id_proyecto: number;
    nombre_proyecto: string;
}

export interface IServidoresResponse {
    items: IServidor[];
    total: number;
}