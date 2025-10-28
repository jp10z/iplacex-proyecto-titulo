import React, { createContext, useState, useCallback, type ReactNode } from "react";
import type { TipoToast, ToastMensaje, ToastContextType } from "@/interfaces/toast";

const initialContext: ToastContextType = {
  mostrarToast: () => {},
  eliminarToast: () => {},
  toasts: [],
};

export const ToastContext = createContext<ToastContextType>(initialContext);

let toastId = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMensaje[]>([]);

  const eliminarToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const mostrarToast = useCallback((tipo: TipoToast, titulo: string, detalle?: string) => {
    const newToast: ToastMensaje = {
      id: ++toastId,
      tipo,
      titulo,
      detalle,
    };

    setToasts(prevToasts => [...prevToasts, newToast]);

    setTimeout(() => {
      eliminarToast(newToast.id);
    }, 5000); 

  }, [eliminarToast]);

  return (
    <ToastContext.Provider value={{ mostrarToast, eliminarToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};