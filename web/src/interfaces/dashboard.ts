export interface IServidorEstado {
    id: number;
    nombre: string;
    nombre_proyecto: string;
    fecha_acceso: string | null;
    duracion_minutos: number | null;
}

export interface IDashboardEstadosResponse {
    items: IServidorEstado[];
}

export interface IServidorEstadoDetalles {
    id_servidor: number;
    nombre_servidor: string;
    descripcion_servidor: string;
    nombre_proyecto: string;
    fecha_acceso: string;
    duracion_minutos: number;
    notas: string | null;
    id_usuario: number;
    nombre_usuario: string;
}
export interface IServidorEstadoDetallesResponse {
    item: IServidorEstadoDetalles;
}