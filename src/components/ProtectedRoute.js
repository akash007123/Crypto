import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <h2>आपके पास इस पेज को एक्सेस करने की अनुमति नहीं है!</h2>;
    }

    return children;
};

export default ProtectedRoute;
