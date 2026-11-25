import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import LoadingState from "./LoadingState";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingState />;
    }

    if (!user) {
        return <Navigate to="/account/login" state={{ from: location }} replace />;
    }

    return children;
}
