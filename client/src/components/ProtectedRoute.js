import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const ProtectedRoute = ({ children }) => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const user = cookies.get('user-info');
  console.log('hello');
  useEffect(() => {
    if (!user) {
      return navigate('/login');
    }
  });
  return children;
};

export default ProtectedRoute;
