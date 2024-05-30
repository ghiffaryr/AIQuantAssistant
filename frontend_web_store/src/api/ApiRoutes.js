import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "../pages/main/HomePage";
import LoginPage from "../pages/main/LoginPage";
import RegisterPage from "../pages/main/login/RegisterPage";
import NotFoundPage from "../pages/exception/NotFoundPage";
import CategoryPage from "../pages/main/CategoryPage";
import RecoverPage from "../pages/main/login/RecoverPage";
import ProductByCategoryPage from "../pages/main/category/ProductByCategoryPage";
import CartPage from "../pages/main/CartPage";
import ProductPage from "../pages/main/ProductPage";
import NewsPage from "../pages/main/NewsPage";
import OrderPage from "../pages/main/OrderPage";
import SubscriptionPage from "../pages/main/SubscriptionPage";
import UnauthenticatedAndCustomerAccess from "../components/protected/UnauthenticatedAndCustomerAccess";
import ProfilePage from "../pages/main/ProfilePage";
import AuthenticatedAccess from "../components/protected/AuthenticatedAccess";
import StockPage from "../pages/main/services/StockPage";
import SentimentAnalysisPage from "../pages/main/services/SentimentAnalysisPages";
import NarrativeSummary from "../pages/main/services/NarrativeSummary";
import AnalysisResult from "../pages/main/services/AnalysisResultPages";

function ApiRoutes() {
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
      <Route
        path="/services/forecasting"
        element={
          <AuthenticatedAccess>
            <SubscriptionPage />
          </AuthenticatedAccess>
        }
      />
      <Route 
        path="/services/stocks"
        element={
          <AuthenticatedAccess>
            <StockPage />
          </AuthenticatedAccess>
        }
      />
      <Route 
        path="/services/sentiment-analysis"
        element={
          <AuthenticatedAccess>
            <SentimentAnalysisPage />
          </AuthenticatedAccess>
        }
      />
      <Route 
        path="/services/summary"
        element={
          <AuthenticatedAccess>
            <NarrativeSummary />
          </AuthenticatedAccess>
        }
      />
      <Route 
        path="/services/result"
        element={
          <AuthenticatedAccess>
            <AnalysisResult />
          </AuthenticatedAccess>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default ApiRoutes;
