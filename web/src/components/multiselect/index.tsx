import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import classes from "./index.module.css";

type Props = {
    opciones: {
        valor: string | number;
        etiqueta: string;
    }[],
    seleccionados: Array<string | number>,
    setSeleccionados: (seleccionados: Array<string | number>) => void,
}

export function MultiSelect({opciones, seleccionados, setSeleccionados}: Props) {
    const [abierto, setAbierto] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [coordenadas, setCoordenadas] = useState({ top: 0, left: 0, width: 0 });

    function toggleOpcion(opcion: string | number) {
        // cuando se selecciona una opción se quita o agregar de la lista de seleccionados
        if (seleccionados.includes(opcion)) {
            setSeleccionados(seleccionados.filter((s) => s !== opcion));
        } else {
            setSeleccionados([...seleccionados, opcion]);
        }
    }

    function mostrarOcultar() {
        // muestra u oculta el dropdown y calcula sus coordenadas
        if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setCoordenadas({
            top: rect.bottom + window.scrollY,
            left: rect.left,
            width: rect.width,
        });
        }
        setAbierto(!abierto);
    }

    function obtenerEtiquetasSeleccionadas(): string {
        return opciones
            .filter((opcion) => seleccionados.includes(opcion.valor))
            .map((opcion) => opcion.etiqueta)
            .join(", ");
    }

    useEffect(() => {
        const close = (e: MouseEvent) => {
        const target = e.target as Node;
        // esto soluciona el problema que se cerrar al hacer click adentro
        if (ref.current?.contains(target) || dropdownRef.current?.contains(target))
            return;
            setAbierto(false);
        };
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, []);

    const dropdown = (
        <div
            ref={dropdownRef}
            className={classes.dropdown}
            style={{
                top: coordenadas.top,
                left: coordenadas.left,
                width: coordenadas.width,
            }}
        >
        {opciones.map((opcion) => (
            <label key={opcion.valor} style={{ display: "block", padding: 4 }}>
            <input
                type="checkbox"
                checked={seleccionados.includes(opcion.valor)}
                onChange={() => toggleOpcion(opcion.valor)}
            />{" "}
            {opcion.etiqueta}
            </label>
        ))}
        </div>
    );

    return (
        <div ref={ref} style={{ position: "relative", width: "100%" }}>
            <div
                onClick={mostrarOcultar}
                className={classes.seleccion}
            >
                <span>
                {seleccionados.length
                    ? obtenerEtiquetasSeleccionadas() : "Sin seleccionar..."}
                </span>
                <span>▼</span>
            </div>
            {abierto && createPortal(dropdown, document.body)}
        </div>
    );
}
