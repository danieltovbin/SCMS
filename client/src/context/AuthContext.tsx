import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider:FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    
    const handleIsAuth = () => {
        try {
            const userRole = Cookies.get('user_role');
            const accessToken = Cookies.get('access_token');

            if (!userRole || !accessToken) {
                throw new Error('No token found')
            }

            if (accessToken && userRole) {
                setIsAuthenticated(true);
                if (userRole === 'admin') {
                    setIsAdmin(true)
                }
            }

            setLoading(false);
        } catch (err) {
            console.error('Error in authentication:', err)
        }
    }

    useEffect(() => {
        handleIsAuth()
    }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, loading}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error("useAuthContext must be used whithin a AuthProvider");
    }
  
    return context;
  };
  