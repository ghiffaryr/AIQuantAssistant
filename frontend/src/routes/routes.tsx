import { Routes, Route, useLocation } from 'react-router-dom';

import React from 'react';
// import CartPage from '@/pages/main/CartPage';
import NotFoundPage from '@/pages/exception/NotFoundPage';
import LoginPage from '@/pages/main/LoginPage';
import HomePage from '@/pages/main/HomePage';
import NewsPage from '@/pages/main/NewsPage';
import OrderPage from '@/pages/main/OrderPage';
import ProductPage from '@/pages/main/ProductPage';
import CategoryPage from '@/pages/main/CategoryPage';
import ProductByCategoryPage from '@/pages/category/ProductByCategoryPage';

const PageRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/cart" element={<CartPage />} /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/order" element={<OrderPage />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/category" element={<CategoryPage />} />
      <Route path="/category/:code" element={<ProductByCategoryPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default PageRoutes;
