import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Home'; // Assuming Dashboard is Home
import NotFound from '../pages/NotFound';
import ProtectedRoute from './protectedRoute';
import MainLayout from '../layout/MainLayout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

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
