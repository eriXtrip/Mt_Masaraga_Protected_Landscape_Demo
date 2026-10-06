import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooking from './pages/admin/AdminBooking';
import AdminPayment from './pages/admin/AdminPayment';
import AdminTrail from './pages/admin/AdminTrail';
import AdminGuides from './pages/admin/AdminGuides';
import AdminContent from './pages/admin/AdminContent';
import AdminAnnouncement from './pages/admin/AdminAnnouncement';
import AdminReports from './pages/admin/AdminReports';
import AdminUser from './pages/admin/AdminUser';
import AdminSettings from './pages/admin/AdminSettings';
import AdminSection from './pages/admin/AdminSection';
import ScrollToTop from './components/common/ScrollToTop';
import { ADMIN_SECTIONS } from './admin/navConfig';
import { Toaster } from './components/ui/toast';
import { applyNoindex } from './lib/seo';

import '../css/app.css';

// Keep the console out of search results. The HTML shell also carries this tag
// for crawlers that never execute the bundle below.
applyNoindex('Admin Console', 'Internal administration console. Not for public indexing.');

// Helper to safely read and parse stored session
function getStoredUser() {
    try {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        return null;
    }
}

// Security Gate to ensure user is logged in and has Admin privileges (e.g., role === 1)
function AdminAccessGate({ children }) {
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const user = getStoredUser();
        if (!user) {
            window.location.replace('/login');
            return;
        }
        // Change role condition below if your admin role uses a different key/value (e.g., role !== 'admin')
        if (user.role !== 1) {
            window.location.replace('/access-denied');
            return;
        }
        setChecking(false);
    }, []);

    if (checking) {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-surface px-6 text-center text-on-surface">
                <div>
                    <p className="text-sm font-semibold">Checking admin access...</p>
                    <p className="mt-2 text-xs text-on-surface-variant">Please wait while your admin console loads.</p>
                </div>
            </div>
        );
    }

    return children;
}

// Fallback screen for non-existent admin routes
function AdminNotFound() {
    return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <div className="max-w-md text-center">
                <p className="text-sm font-bold text-primary">Admin page not found</p>
                <h1 className="mt-2 text-2xl font-bold text-on-surface">This view is not available</h1>
                <p className="mt-2 text-sm text-on-surface-variant">Use the navigation menu to return to an authorized console area.</p>
                <Link to="/admin/dashboard" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-on-secondary hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    Return to dashboard
                </Link>
            </div>
        </div>
    );
}

const ADMIN_ROUTE_PATHS = Object.keys(ADMIN_SECTIONS);
const GENERIC_SECTION_PATHS = (path) =>
    path !== '/admin/dashboard' &&
    path !== '/admin/bookings' &&
    path !== '/admin/payments' &&
    path !== '/admin/trails' &&
    path !== '/admin/guides' &&
    path !== '/admin/content' &&
    path !== '/admin/announcements' &&
    path !== '/admin/reports' &&
    path !== '/admin/users' &&
    path !== '/admin/settings';

const AdminApp = () => (
    <BrowserRouter>
        <ScrollToTop />
        <Toaster />
        <Routes>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

            {/* Wrap protected routes inside AdminAccessGate */}
            <Route element={<AdminAccessGate><AdminLayout /></AdminAccessGate>}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/bookings" element={<AdminBooking />} />
                <Route path="/admin/payments" element={<AdminPayment />} />
                <Route path="/admin/trails" element={<AdminTrail />} />
                <Route path="/admin/guides" element={<AdminGuides />} />
                <Route path="/admin/content" element={<AdminContent />} />
                <Route path="/admin/announcements" element={<AdminAnnouncement />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/users" element={<AdminUser />} />
                <Route path="/admin/settings" element={<AdminSettings />} />

                {ADMIN_ROUTE_PATHS.filter(GENERIC_SECTION_PATHS).map((path) => (
                    <Route key={path} path={path} element={<AdminSection />} />
                ))}

                <Route path="/admin/*" element={<AdminNotFound />} />
            </Route>
        </Routes>
    </BrowserRouter>
);

// Prevent HMR from calling createRoot repeatedly on the same DOM element.
const container = document.getElementById('admin-app');

if (container) {
    if (!window.__adminReactRoot) {
        window.__adminReactRoot = ReactDOM.createRoot(container);
    }

    window.__adminReactRoot.render(
        <React.StrictMode>
            <AdminApp />
        </React.StrictMode>
    );
}