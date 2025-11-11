import React from "react";
import type { ToastMensaje } from "@/interfaces/toast";

interface ToastItemProps {
  toast: ToastMensaje;
  onClose: (id: number) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {

  return (
    <div className={`toast-item toast-${toast.tipo}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0 }}>{toast.titulo}</h4>
        <button 
          onClick={() => onClose(toast.id)} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em' }}
        >
          &times; 
        </button>
      </div>
      {toast.detalle && <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>{toast.detalle}</p>}
    </div>
  );
};

export default ToastItem;