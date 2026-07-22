import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Al cargar la app, comprobamos silenciosamente si ya hay una sesión activa en Laravel
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const userData = await authService.getProfile();
            setUser(userData);
        } catch (error) {
            setUser(null); // No hay sesión o expiró
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials) => {
        await authService.login(credentials);
        await checkAuth(); // Refrescamos los datos del usuario tras el login
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);
