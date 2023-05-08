import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "../pages/main/HomePage";
import LoginPage from "../pages/main/LoginPage";
import RegisterPage from "../pages/main/login/RegisterPage";
import NotFoundPage from "../pages/exception/NotFoundPage";
import CategoryPage from "../pages/main/CategoryPage";
import RecoveryPage from "../pages/main/login/RecoveryPage";
import ProductByCategoryPage from "../pages/main/category/ProductByCategoryPage";
import CartPage from "../pages/main/CartPage";
import ProductPage from "../pages/main/ProductPage";
import NewsPage from "../pages/main/NewsPage";
import OrderPage from "../pages/main/OrderPage";
import SubscriptionPage from "../pages/main/SubscriptionPage";
import UnauthenticatedAndCustomerAccess from "../components/protected/UnauthenticatedAndCustomerAccess";
// import CartPage from '../pages/CartPage';
// import UsersPage from '../pages/UsersPage';
// import StorePage from '../pages/StorePage';
// import DetailsPage from '../pages/DetailsPage';
// import ProfilePage from '../pages/ProfilePage';
// import OrdersPage from '../pages/OrdersPage';
// import ProtectedRoutes from '../pages/ProtectedRoutes';

function ApiRoutes() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/recovery" element={<RecoveryPage />} />
      <Route
        path="/cart"
        element={
          <UnauthenticatedAndCustomerAccess>
            <CartPage />
          </UnauthenticatedAndCustomerAccess>
        }
      />
      {/* <Route element={<ProtectedRoutes />}>
                {' '}
                <Route path='/profile' element={<ProfilePage />} />
            </Route> */}
      <Route path="/category" element={<CategoryPage />} />
      <Route path="/category/:code" element={<ProductByCategoryPage />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/order" element={<OrderPage />} />
      <Route path="/subscription" element={<SubscriptionPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default ApiRoutes;
