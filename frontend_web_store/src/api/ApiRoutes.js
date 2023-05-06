import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";
import CategoryPage from "../pages/CategoryPage";
import RecoveryPage from "../pages/RecoveryPage";
import ProductByCategoryPage from "../pages/ProductByCategoryPage";
import CartPage from "../pages/CartPage";
import CustomerAccess from "../components/protected/CustomerAccess";
import ProductPage from "../pages/ProductPage";
import NewsPage from "../pages/NewsPage";
import OrderPage from "../pages/OrderPage";
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
          <CustomerAccess>
            <CartPage />
          </CustomerAccess>
        }
      />
      {/* <Route element={<ProtectedRoutes />}>
                {' '}
                <Route path='/users' element={<UsersPage />} />
            </Route> */}
      {/* <Route element={<ProtectedRoutes />}>
                {' '}
                <Route path='/profile' element={<ProfilePage />} />
            </Route> */}
      {/* <Route element={<ProtectedRoutes />}>
                {' '}
                <Route path='/orders' element={<OrdersPage />} />
            </Route> */}
      {/* <Route path='/books' element={<StorePage />} />
            <Route path='/books/:id' element={<DetailsPage />} /> */}
      <Route path="/category" element={<CategoryPage />} />
      <Route path="/category/:code" element={<ProductByCategoryPage />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/order" element={<OrderPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default ApiRoutes;
