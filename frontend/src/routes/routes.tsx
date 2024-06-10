import { Routes, Route, useLocation } from 'react-router-dom';
import NavbarComponent from '@/components/commons/NavbarComponent';

import React from 'react';

const PageRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<NavbarComponent />} />
    </Routes>
  );
};

export default PageRoutes;
