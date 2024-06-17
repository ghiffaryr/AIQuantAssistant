import { Routes, Route, useLocation } from 'react-router-dom';
import NavbarComponent from '@/components/commons/NavbarComponent';

import React from 'react';
// import CartPage from '@/pages/main/CartPage';
import NotFoundPage from '@/pages/exception/NotFoundPage';
import LoginPage from '@/pages/main/LoginPage';

const PageRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<NavbarComponent />} />
      {/* <Route path="/cart" element={<CartPage />} /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default PageRoutes;
