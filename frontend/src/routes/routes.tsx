import { Routes, Route, useLocation } from 'react-router-dom';

import React from 'react';
// import CartPage from '@/pages/main/CartPage';
import NotFoundPage from '@/pages/exception/NotFoundPage';
import LoginPage from '@/pages/main/LoginPage';
import HomePage from '@/pages/main/HomePage';
import NewsPage from '@/pages/main/NewsPage';

const PageRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/cart" element={<CartPage />} /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/news" element={<NewsPage />} />
    </Routes>
  );
};

export default PageRoutes;
