import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children}) => {
    
    const activeSession = useSelector((store) => store.user.sessionActive);

    if (!activeSession) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
