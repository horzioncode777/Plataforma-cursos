import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Consetics from "./pages/Consetics";
import Noticias from "./pages/Noticias";
import Login from "./pages/Login";
import LoginUser from "./pages/LoginUser";
import RegisterUser from "./pages/RegisterUser";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import AdminPanel from "./pages/adminPanel";
import AdminNoticias from "./pages/adminNoticias.jsx";
import AdminConsetics from "./pages/AdminConsetics";
import MiPerfil from "./pages/MiPerfil.jsx";
import AdminUsuarios from "./pages/AdminUsuarios.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProtectedUserRoute from "./components/ProtectedUserRoute.jsx";
import CursoDetalle from "./pages/CursoDetalle";
import CursoModulo from "./pages/CursoModulo"; // ✅ Importado

// Componente para rutas con Navbar
const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <Routes>
      {/* Rutas públicas con Navbar */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/consetics"
        element={
          <Layout>
            <Consetics />
          </Layout>
        }
      />
      <Route
        path="/noticias"
        element={
          <Layout>
            <Noticias />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />
      <Route
        path="/loginUser"
        element={
          <Layout>
            <LoginUser />
          </Layout>
        }
      />
      <Route
        path="/registerUser"
        element={
          <Layout>
            <RegisterUser />
          </Layout>
        }
      />
      <Route
        path="/curso/:id"
        element={
          <Layout>
            <CursoDetalle />
          </Layout>
        }
      />
      <Route
        path="/curso/:id/ver"
        element={
          <Layout>
            <CursoModulo />
          </Layout>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <Layout>
            <ForgotPassword />
          </Layout>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <Layout>
            <ResetPassword />
          </Layout>
        }
      />

      {/* Ruta protegida para usuarios */}
      <Route element={<ProtectedUserRoute />}>
        <Route path="/mi-perfil" element={<MiPerfil />} />
      </Route>

      {/* Rutas protegidas para admin */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/adminNoticias" element={<AdminNoticias />} />
        <Route path="/admin/adminConsetics" element={<AdminConsetics />} />
        <Route path="/admin/Adminusuarios" element={<AdminUsuarios />} />
      </Route>
    </Routes>
  );
}

export default App;
