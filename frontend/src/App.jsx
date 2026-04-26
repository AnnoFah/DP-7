import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import FocusMode from './pages/FocusMode';
import Goals from './pages/Goals';
import Reports from './pages/Reports';
import Notes from './pages/Notes';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminReports from './pages/admin/AdminReports';

const Layout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6' }}>
    <Sidebar />
    <main style={{ marginLeft: 220, flex: 1, minHeight: '100vh' }}>{children}</main>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>

          {/* LANDING PAGE */}
          <Route path="/" element={<LandingPage />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* USER ROUTES */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
          } />
          <Route path="/activities" element={
            <ProtectedRoute><Layout><Activities /></Layout></ProtectedRoute>
          } />
          <Route path="/focus-mode" element={
            <ProtectedRoute><Layout><FocusMode /></Layout></ProtectedRoute>
          } />
          <Route path="/goals" element={
            <ProtectedRoute><Layout><Goals /></Layout></ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>
          } />
          <Route path="/notes" element={
            <ProtectedRoute><Layout><Notes /></Layout></ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>
          } />
<Route path="/profile" element={
  <ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>
} />

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><Layout><AdminDashboard /></Layout></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly><Layout><AdminUsers /></Layout></ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute adminOnly><Layout><AdminCategories /></Layout></ProtectedRoute>
          } />
          <Route path="/admin/notifications" element={
            <ProtectedRoute adminOnly><Layout><AdminNotifications /></Layout></ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute adminOnly><Layout><AdminReports /></Layout></ProtectedRoute>
          } />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}