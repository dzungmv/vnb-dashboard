import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

type Props = {
    children: JSX.Element;
};

const PrivateRoute: React.FC<Props> = ({ children }) => {
    const user = useSelector((state: any) => state.user.user);
    const checkLogin = Boolean(user?.tokens?.accessToken);

    return checkLogin ? children : <Navigate to='/login' replace />;
};

export default PrivateRoute;
