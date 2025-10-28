import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { ConsolaPage} from "@/pages/consola";
import { ErrorPage404 } from "@/pages/error/404";
import { ToastProvider } from "@/context/ToastContext";
import { ToastContenedor } from "@/components/toast/ToastContenedor";

function App() {

  return (
      <ToastProvider>
        <ToastContenedor />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/consola" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/consola/*" element={<ConsolaPage />} />
            <Route path="*" element={<ErrorPage404 />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
  )
}

export default App
