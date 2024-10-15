import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

function UsersAdmin() {
  const { isAdmin } = useAuthContext();

  if (!isAdmin) {
    return <Navigate to="/home" />
  }
  return (
    <div>UsersAdmin</div>
  )
}

export default UsersAdmin