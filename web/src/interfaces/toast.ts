export type TipoToast = "info" | "success" | "warning" | "error";

export interface ToastMensaje {
    id: number;
    tipo: TipoToast;
    titulo: string;
    detalle?: string;
}

export interface ToastContextType {
    mostrarToast: (tipo: TipoToast, titulo: string, detalle?: string) => void;
    eliminarToast: (id: number) => void;
    toasts: ToastMensaje[];
}