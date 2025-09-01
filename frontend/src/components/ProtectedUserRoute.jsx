import { Navigate, Outlet } from "react-router-dom";

const ProtectedUserRoute = () => {
  const token = localStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/LoginUser" />;
};

export default ProtectedUserRoute;
