import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children }) {
    const location = useLocation();
    console.log(location)
    
    if (!localStorage.getItem('token')) {
        return <Navigate to='/sign-in' state={{ from: location }} />
    }

    return children;
}