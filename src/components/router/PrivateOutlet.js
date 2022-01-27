import { Navigate, Outlet } from "react-router-dom";
import useAuth from "./useAuth";
import { verifyToken } from "./useAuth";
export default function PrivateOutlet() {
  const auth = useAuth(verifyToken);
  console.log(auth)
  return auth ? <Outlet /> : <Navigate to="/login" />;
}