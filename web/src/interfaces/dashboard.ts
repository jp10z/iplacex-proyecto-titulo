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