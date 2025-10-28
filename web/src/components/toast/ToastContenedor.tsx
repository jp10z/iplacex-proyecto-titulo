import React, { useContext, useEffect } from "react";
import { ToastContext } from "@/context/ToastContext";
import { inicializarServicioToast } from "@/common/toast";
import ToastItem from "./ToastItem";
import classes from "./ToastContenedor.module.css";

export const ToastContenedor: React.FC = () => {
  const { toasts, eliminarToast, mostrarToast } = useContext(ToastContext);

  useEffect(() => {
      inicializarServicioToast(mostrarToast);
  }, [mostrarToast]);

  return (
    <div className={classes.toastContenedor}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={eliminarToast} />
      ))}
    </div>
  );
};