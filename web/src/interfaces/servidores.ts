export interface IServidor {
    id: number;
    nombre: string;
    descripcion: string;
    proyecto: string;
}

export interface IServidoresResponse {
    items: IServidor[];
    total: number;
}