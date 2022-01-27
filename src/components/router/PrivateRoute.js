import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";
import PageLayout from "../../layout/PageLayout";
import { verifyToken } from "./useAuth";

export default function PrivateRoute({title, children }) {
    const auth = useAuth(verifyToken);
    return auth ?<PageLayout title={title}>{children}</PageLayout> : <Navigate to="/login" />;
}
