import { Route, Routes } from 'react-router-dom';
// import CartPage from '@/pages/main/CartPage';
import AuthenticatedAccess from '@/components/protected/AuthenticatedAccess';
import InferencePage from '@/pages/services/InferencePage';
import StockPage from '@/pages/services/StockPage';
import SentimentAnalysisPage from '@/pages/services/SentimentAnalysisPages';
import AnalysisResult from '@/pages/services/AnalysisResultPages';
import NarrativeSummary from '@/pages/services/NarrativeSummary';
import NotFoundPage from '@/pages/exception/NotFoundPage';
import Sidebar from '@/components/commons/Sidebar';

const ServicesRoutes = () => (
  <Routes>
    <Route index element={<NotFoundPage />} />
    <Route
      path="/forecasting"
      element={
        <AuthenticatedAccess>
          <Sidebar>
            <InferencePage />
          </Sidebar>
        </AuthenticatedAccess>
      }
    />
    <Route
      path="/stocks"
      element={
        <AuthenticatedAccess>
          <Sidebar>
            <StockPage />
          </Sidebar>
        </AuthenticatedAccess>
      }
    />
    <Route
      path="/sentiment-analysis"
      element={
        <AuthenticatedAccess>
          <Sidebar>
            <SentimentAnalysisPage />
          </Sidebar>
        </AuthenticatedAccess>
      }
    />
    <Route
      path="/summary"
      element={
        <AuthenticatedAccess>
          <Sidebar>
            <NarrativeSummary />
          </Sidebar>
        </AuthenticatedAccess>
      }
    />
    <Route
      path="/result"
      element={
        <AuthenticatedAccess>
          <Sidebar>
            <AnalysisResult />
          </Sidebar>
        </AuthenticatedAccess>
      }
    />
  </Routes>
);

export default ServicesRoutes;
