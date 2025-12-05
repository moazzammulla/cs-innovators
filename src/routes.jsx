import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
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
import DashboardLayout from './layouts/DashboardLayout';

function PublicLayoutRoute({ children }) {
  return <MainLayout>{children}</MainLayout>;
}

function PrivateDashboardRoute({ children }) {
  // In a real app, you would check auth/role here.
  return <DashboardLayout>{children}</DashboardLayout>;
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
        <PrivateDashboardRoute>
          <CanteenDashboard />
        </PrivateDashboardRoute>
      ),
    },
    {
      path: '/ngo/dashboard',
      element: (
        <PrivateDashboardRoute>
          <NgODashboard />
        </PrivateDashboardRoute>
      ),
    },
    {
      path: '/canteen/add-surplus',
      element: (
        <PrivateDashboardRoute>
          <AddSurplusPage />
        </PrivateDashboardRoute>
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
