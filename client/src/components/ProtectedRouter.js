import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const ProtectedRouter = ({ children }) => {
  const cookies = new Cookies();
  const user = cookies.get('user-info');

  if (!user?._id) {
    return <Navigate to="/login" replace />;
  }
  return <div>{children}</div>;
};

export default ProtectedRouter;
