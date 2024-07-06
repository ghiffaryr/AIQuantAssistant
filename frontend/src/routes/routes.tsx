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
import ProfilePage from '@/pages/main/ProfilePage';
import CartPage from '@/pages/main/CartPage';
import RegisterPage from '@/pages/login/RegisterPage';
import RecoverPage from '@/pages/login/RecoverPage';
import AuthenticatedAccess from '@/components/protected/AuthenticatedAccess';
import UnauthenticatedAndCustomerAccess from '@/components/protected/UnauthenticatedAndCustomerAccess';
import ServicesRoutes from './services';

const PageRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/recover" element={<RecoverPage />} />
      <Route
        path="/cart"
        element={
          <UnauthenticatedAndCustomerAccess>
            <CartPage />
          </UnauthenticatedAndCustomerAccess>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthenticatedAccess>
            <ProfilePage />
          </AuthenticatedAccess>
        }
      />
      <Route path="/category" element={<CategoryPage />} />
      <Route path="/category/:code" element={<ProductByCategoryPage />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route
        path="/order"
        element={
          <AuthenticatedAccess>
            <OrderPage />
          </AuthenticatedAccess>
        }
      />
      <Route path="services/*" element={<ServicesRoutes />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default PageRoutes;
