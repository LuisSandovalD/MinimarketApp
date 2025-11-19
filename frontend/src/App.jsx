import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppRoutePublic from "./routes/AppRoutePublic";
import AppRouteAdmin from "./routes/AppRouteAdmin";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        {AppRoutePublic()}

        {/* Rutas privadas / administrativas */}
        {AppRouteAdmin()}

        {/* Ruta para página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
