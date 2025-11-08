export interface IEvento {
    id: number;
    nombre_tipo_evento: string;
    detalle: string;
    fecha_creacion: string;
    nombre_usuario: string;
    nombre_servidor: string | null;
}

export interface IEventosResponse {
    items: IEvento[];
    total: number;
}

export interface IEventoDatos {
    id: number;
    nombre_tipo_evento: string;
    detalle: string;
    fecha_creacion: string;
    nombre_usuario: string;
    nombre_servidor: string | null;
    datos: Record<string, any> | null;
}

export interface IEventoDatosResponse {
    item: IEventoDatos;
}