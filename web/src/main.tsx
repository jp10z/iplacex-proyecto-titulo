import { createRoot } from "react-dom/client";

// css
import "./index.css";
import "./css/contenedores.css";
import "./css/inputs.css";
import "./css/botones.css";
import "./css/tablas.css";
import "./css/navbar.css";
import "./css/modal.css";
import "./css/toast.css";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <App />
)
