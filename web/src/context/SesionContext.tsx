import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { obtenerDatosSesion } from "@/api/auth";
import type { IDatosSesion } from "@/interfaces/auth";

interface SesionContextType {
  autenticado: boolean;
  datosSesion: IDatosSesion | null;
  fetchingDatosSesion: boolean;
  refreshDatosSesion: () => Promise<void>;
  clearSesion: () => void;
}

const SesionContext = createContext<SesionContextType | undefined>(undefined);

interface SesionProviderProps {
  children: ReactNode;
}

export const SesionProvider = ({ children }: SesionProviderProps) => {
  const [autenticado, setAutenticado] = useState<boolean>(false);
  const [datosSesion, setDatosSesion] = useState<IDatosSesion | null>(null);
  const [fetchingDatosSesion, setFetchingDatosSesion] = useState<boolean>(true);

  const fetchDatosSesion = async () => {
    setFetchingDatosSesion(true);
    const controller = new AbortController();
    try {
      const response = await obtenerDatosSesion(controller.signal);
      if (response && response.data) {
        setAutenticado(true);
        setDatosSesion(response.data);
      } else {
        setAutenticado(false);
        setDatosSesion(null);
      }
    } catch (error) {
      console.error("Error al verificar la sesión:", error);
      setAutenticado(false);
      setDatosSesion(null);
    } finally {
      setFetchingDatosSesion(false);
    }
  };

  useEffect(() => {
    fetchDatosSesion();
  }, []);
  
  const refreshDatosSesion = async () => {
    await fetchDatosSesion();
  };

  const clearSesion = () => {
    setAutenticado(false);
    setDatosSesion(null);
  };

  return (
    <SesionContext.Provider
      value={{
        autenticado,
        datosSesion,
        fetchingDatosSesion,
        refreshDatosSesion,
        clearSesion,
      }}
    >
      {children}
    </SesionContext.Provider>
  );
};

export const useSesion = (): SesionContextType => {
  const context = useContext(SesionContext);
  if (context === undefined) {
    throw new Error("useSesion debe usarse dentro de un SesionProvider");
  }
  return context;
};
