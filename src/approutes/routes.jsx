import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Home'; // Assuming Dashboard is Home
import NotFound from '../pages/NotFound';
import ProtectedRoute from './protectedRoute';
import MainLayout from '../layout/MainLayout';
import ProductManagement from '../pages/ProductSection';
import { FullScreenCalendar } from '../pages/CalendarSection.jsx';
import HomeSection from '../pages/WebsitePages/HomeSection.jsx';
import OurStorySection from '../pages/WebsitePages/OurStorySection.jsx';
import PortfolioSection from '../pages/WebsitePages/PortfolioSection.jsx';
import ContactUsSection from '../pages/WebsitePages/ContactUsSection.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />
      <Route path="/product" element={<ProductManagement />} />
      <Route path="/calendar" element={<FullScreenCalendar />} />
      <Route path="/home-section" element={<HomeSection/>} />
      <Route path="/ourstory-section" element={<OurStorySection/>} />
      <Route path="/portfolio-section" element={<PortfolioSection/>} />
      <Route path="/contactus-section" element={<ContactUsSection/>} />
      

      {/* Protected Route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback for unknown routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
