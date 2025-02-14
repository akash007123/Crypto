import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // API से यूज़र का रोल लाना या localStorage से लोड करना
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser) {
            setUser(loggedInUser);
        }
    }, []);

    // ✅ Logout function
    const logout = () => {
        localStorage.removeItem("user"); // 🛑 यूज़र डेटा हटाएँ
        setUser(null); // 🛑 यूज़र स्टेट null करें
        window.location.href = "/login"; // 🛑 लॉगिन पेज पर रीडायरेक्ट करें
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
