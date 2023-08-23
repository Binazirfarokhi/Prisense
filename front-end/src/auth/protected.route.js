import { Navigate } from "react-router-dom";
import { useAuthContext } from "./index";

export const ProtectedRoute = ({ children }) => {
  const { authed } = useAuthContext();
  return authed ? children : <Navigate to={"/login"} />;
};
