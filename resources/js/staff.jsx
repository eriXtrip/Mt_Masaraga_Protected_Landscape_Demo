import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, Link } from 'react-router-dom';
import StaffLayout from './components/staff/StaffLayout';
import StaffBookings from './pages/staff/StaffBookings';
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffGroup from './pages/staff/StaffGroup';
import StaffMessages from './pages/staff/StaffMessages';
import StaffReports from './pages/staff/StaffReports';
import StaffSchedules from './pages/staff/StaffSchedules';
import StaffVerify from './pages/staff/StaffVerify';
import ScrollToTop from './components/common/ScrollToTop';
import { Toaster } from './components/ui/toast';
import { applyNoindex } from './lib/seo';

import '../css/app.css';

// Keep the console out of search results. The HTML shell also carries this tag
// for crawlers that never execute the bundle below.
applyNoindex('Park Staff Console', 'Field operations console for park staff and guides. Not for public indexing.');

function getStoredUser() {
    try {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        return null;
    }
}

function StaffAccessGate({ children }) {
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const user = getStoredUser();
        if (!user) {
            window.location.replace('/login');
            return;
        }
        if (user.role !== 2) {
            window.location.replace('/access-denied');
            return;
        }
        setChecking(false);
    }, []);

    if (checking) {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-surface px-6 text-center text-on-surface">
                <div>
                    <p className="text-sm font-semibold">Checking staff access...</p>
                    <p className="mt-2 text-xs text-on-surface-variant">Please wait while your duty console loads.</p>
                </div>
            </div>
        );
    }

    return children;
}

function StaffNotFound() {
    return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <div className="max-w-md text-center">
                <p className="text-sm font-bold text-primary">Staff page not found</p>
                <h1 className="mt-2 text-2xl font-bold text-on-surface">This field view is not available</h1>
                <p className="mt-2 text-sm text-on-surface-variant">Use the staff navigation to return to an assigned duty page.</p>
                <Link to="/staff/dashboard" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-on-secondary hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Return to dashboard</Link>
            </div>
        </div>
    );
}

function StaffApp() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Toaster />
            <Routes>
                <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
                <Route element={<StaffAccessGate><StaffLayout /></StaffAccessGate>}>
                    <Route path="/staff/dashboard" element={<StaffDashboard />} />
                    <Route path="/staff/schedules" element={<StaffSchedules />} />
                    <Route path="/staff/verify" element={<StaffVerify />} />
                    <Route path="/staff/bookings" element={<StaffBookings />} />
                    <Route path="/staff/groups/:id" element={<StaffGroup />} />
                    <Route path="/staff/messages" element={<StaffMessages />} />
                    <Route path="/staff/reports" element={<StaffReports />} />
                    <Route path="/staff/*" element={<StaffNotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const container = document.getElementById('staff-app');

if (container) {
    if (!window.__staffReactRoot) {
        window.__staffReactRoot = ReactDOM.createRoot(container);
    }

    window.__staffReactRoot.render(
        <React.StrictMode>
            <StaffApp />
        </React.StrictMode>
    );
}
