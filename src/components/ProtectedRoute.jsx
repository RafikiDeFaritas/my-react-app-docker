import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  if (!isLoggedIn()) {
    // redirige vers /login en gardant la route d'origine
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
