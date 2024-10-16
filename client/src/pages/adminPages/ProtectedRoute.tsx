import { FC, ReactNode } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import PageNotFound from '../page404/PageNotFound';

interface ProtectedRouteProps {
    children: ReactNode;
};

const ProtectedRoute:FC<ProtectedRouteProps> = ({children}) => {
    const { isAdmin, loading } = useAuthContext();

    if (loading) return <div>Loading...</div>

    if (!isAdmin) {
        return <PageNotFound />
    }
 
    return children
}

export default ProtectedRoute;
