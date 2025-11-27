import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const token = localStorage.getItem("authToken");
    if (!isLoggedIn || !token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
