import React from 'react';
import { useRoutes, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CanteenDashboard from './pages/dashboards/CanteenDashboard';
import NgODashboard from './pages/dashboards/NgODashboard';
import AddSurplusPage from './pages/AddSurplusPage';
import PickupTrackingPage from './pages/PickupTrackingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminPanel from './pages/AdminPanel';
import MainLayout from './layouts/MainLayout';
import CanteenDashboardLayout from './layouts/CanteenDashboardLayout';
import NgODashboardLayout from './layouts/NgODashboardLayout';

function PublicLayoutRoute({ children }) {
  return <MainLayout>{children}</MainLayout>;
}

function CanteenRoute({ children }) {
  return <CanteenDashboardLayout>{children}</CanteenDashboardLayout>;
}

function NgORoute({ children }) {
  return <NgODashboardLayout>{children}</NgODashboardLayout>;
}

function PrivateDashboardRoute({ children }) {
  // Determine layout based on current path
  const location = useLocation();
  const path = location.pathname;
  
  if (path.startsWith('/ngo/')) {
    return <NgODashboardLayout>{children}</NgODashboardLayout>;
  }
  
  // Default to Canteen layout for canteen routes and shared pages
  return <CanteenDashboardLayout>{children}</CanteenDashboardLayout>;
}

export function AppRoutes() {
  const element = useRoutes([
    {
      path: '/',
      element: (
        <PublicLayoutRoute>
          <LandingPage />
        </PublicLayoutRoute>
      ),
    },
    {
      path: '/login',
      element: (
        <PublicLayoutRoute>
          <LoginPage />
        </PublicLayoutRoute>
      ),
    },
    {
      path: '/signup',
      element: (
        <PublicLayoutRoute>
          <SignupPage />
        </PublicLayoutRoute>
      ),
    },
    {
      path: '/canteen/dashboard',
      element: (
        <CanteenRoute>
          <CanteenDashboard />
        </CanteenRoute>
      ),
    },
    {
      path: '/ngo/dashboard',
      element: (
        <NgORoute>
          <NgODashboard />
        </NgORoute>
      ),
    },
    {
      path: '/canteen/add-surplus',
      element: (
        <CanteenRoute>
          <AddSurplusPage />
        </CanteenRoute>
      ),
    },
    {
      path: '/pickup-tracking',
      element: (
        <PrivateDashboardRoute>
          <PickupTrackingPage />
        </PrivateDashboardRoute>
      ),
    },
    {
      path: '/analytics',
      element: (
        <PrivateDashboardRoute>
          <AnalyticsPage />
        </PrivateDashboardRoute>
      ),
    },
    {
      path: '/admin',
      element: (
        <PrivateDashboardRoute>
          <AdminPanel />
        </PrivateDashboardRoute>
      ),
    },
    { path: '*', element: <Navigate to="/" replace /> },
  ]);

  return element;
}
