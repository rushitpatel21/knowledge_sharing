import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { validateUser } from '../redux/apis/auth';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(validateUser()).unwrap();
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, [dispatch]);

  if (isAuth === null) return <div>Loading...</div>;

  return isAuth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;