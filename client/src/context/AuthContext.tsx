import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios, { AxiosError } from 'axios';

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    isAdmin: boolean;
    setLoading: (loading: boolean) => void;
    loginUser: (username: string, password: string) => Promise<void>;
    logoutUser: () => Promise<void>;
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
        const userRole = Cookies.get('user_role');
        const accessToken = Cookies.get('access_token');
        setIsAuthenticated(!!accessToken);
        setIsAdmin(userRole === 'admin');
        setLoading(false);
    };

    const loginUser = async (username: string, password: string) => {
        try {
            const response = await axios.post('/api/auth/login', { username, password });
            if (response.status === 200) {
                Cookies.set('access_token', response.data.access_token, { expires: 1 });
                Cookies.set('user_role', response.data.role, { expires: 1 });                
                handleIsAuth();
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 401) {
                console.log('Invalid credentials');
            } else {
                console.error('Error logging in:', error);
            }
        }
    };

    const logoutUser = async () => {
        try {
            await axios.post('/api/auth/logout', {}, { withCredentials: true });
            Cookies.remove('access_token');
            Cookies.remove('user_role');

            handleIsAuth();
        } catch (error) {
            console.error('Error in logout user:', error);
        }
    };

    useEffect(() => {
        handleIsAuth()
    }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, loading, setLoading, loginUser , logoutUser}}>
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
  