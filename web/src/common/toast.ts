import type { ToastContextType } from "@/interfaces/toast";

let mostrarToast: ToastContextType["mostrarToast"] = () => {
    console.error("ToastProvider no ha sido montado. Llama a initToastService primero.");
};

export const inicializarServicioToast = (showToastFunc: ToastContextType["mostrarToast"]) => {
    mostrarToast = showToastFunc;
};

export const toast = {
    info: (titulo: string, detalle?: string) => {
        mostrarToast("info", titulo, detalle);
    },
    success: (titulo: string, detalle?: string) => {
        mostrarToast("success", titulo, detalle);
    },
    warning: (titulo: string, detalle?: string) => {
        mostrarToast("warning", titulo, detalle);
    },
    error: (titulo: string, detalle?: string) => {
        mostrarToast("error", titulo, detalle);
    },
};