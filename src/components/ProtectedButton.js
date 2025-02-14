import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";  // या कोई और UI लाइब्रेरी

const ProtectedButton = ({ onClick, children }) => {
    const { user } = useAuth();

    const handleClick = () => {
        if (user?.role === "sub-admin") {
            toast.error("आपके पास यह अनुमति नहीं है!");  
        } else {
            onClick();
        }
    };

    return (
        <button onClick={handleClick} disabled={user?.role === "sub-admin"}>
            {children}
        </button>
    );
};

export default ProtectedButton;
