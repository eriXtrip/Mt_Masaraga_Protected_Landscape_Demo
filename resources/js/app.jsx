import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import SplashScreen from './components/common/SplashScreen';
import InstallPrompt from './components/common/InstallPrompt';
import DemoNoticeBanner from './components/common/DemoNoticeBanner';
import RouteSeo from './components/common/RouteSeo';
import { Toaster } from './components/ui/toast';
import { useAdminStore } from './state/adminStore';

import Home from './pages/home/home';
import About from './pages/about/about';
import Help from './pages/help/help';
import Contact from './pages/contact/contact';
import Signup from './pages/loginSignup/signup';
import Login from './pages/loginSignup/login';
import ForgotPassword from './pages/loginSignup/forgotpassword';
import Trail from './pages/trail/trail';
import Booking from './pages/booking/booking';
import NewsDetail from './pages/content/NewsDetail';
import AwardsDetail from './pages/content/AwardsDetail';
import NotFound from './pages/utilitypage/NotFound';
import AccessDenied from './pages/utilitypage/AccessDenied';
import Maintenance from './pages/utilitypage/Maintenance';
import BookingSuspended from './pages/utilitypage/BookingSuspended';
import PrivacyNotice from './pages/legal/PrivacyNotice';
import CookieTerms from './pages/legal/CookieTerms';
import EcotourismNotice from './pages/legal/EcotourismNotice';
import WildlifeProtection from './pages/legal/WildlifeProtection';
import TermsConditions from './pages/legal/TermsConditions';
import Disclaimer from './pages/legal/Disclaimer';
import RefundPolicy from './pages/legal/RefundPolicy';
import DigitalPasses from './pages/hiker/DigitalPasses';
import ScheduleLookup from './pages/hiker/ScheduleLookup';

import '../css/app.css';

// Layout component that renders Navbar and Footer around child routes
const MainLayout = () => (
    <>
        <Navbar />
        <Outlet />
        <Footer />
    </>
);

const MaintenanceGate = () => {
    const { settings } = useAdminStore();

    if (settings?.maintenance?.enabled) {
        return <Navigate to="/maintenance" replace />;
    }

    return <Outlet />;
};

const BookingGate = () => {
    const { settings } = useAdminStore();

    if (settings?.utility?.bookingSuspended?.enabled) {
        return <Navigate to="/booking-suspended" replace />;
    }

    return <Outlet />;
};

const App = () => {
    // Only show splash screen once per browser session
    const [showSplash, setShowSplash] = useState(() => {
        return !sessionStorage.getItem('hasSeenSplash');
    });

    // Handle smooth unmounting of splash screen
    const handleSplashComplete = useCallback(() => {
        sessionStorage.setItem('hasSeenSplash', 'true');
        setShowSplash(false);
    }, []);

    // Manage body overflow during splash screen
    useEffect(() => {
        if (showSplash) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [showSplash]);

    return (
        <BrowserRouter>
            {showSplash && (
                <SplashScreen onComplete={handleSplashComplete} />
            )}
            <ScrollToTop />
            <Toaster />
            <InstallPrompt />
            {/* Route-driven document metadata. Lives inside the router because it
                reads the current pathname, and before <Routes> so the very first
                paint already carries the right title and canonical. */}
            <RouteSeo />
            {/* Sits above <Routes> so the demo caveat shows on every page,
                including the standalone 404 / access-denied / maintenance views. */}
            <DemoNoticeBanner />
            <Routes>
                {/* Routes wrapped with Navbar and Footer */}
                <Route element={<MaintenanceGate />}>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/trail" element={<Trail />} />
                        <Route path="/trail/:id" element={<Trail />} />
                        <Route path="/help" element={<Help />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route element={<BookingGate />}>
                            <Route path="/booking/:id" element={<Booking />} />
                            <Route path="/booking" element={<Booking />} />
                        </Route>
                        <Route path="/lookup" element={<ScheduleLookup />} />
                        <Route path="/hiker/passes" element={<DigitalPasses />} />
                        <Route path="/news/:id" element={<NewsDetail />} />
                        <Route path="/awards/:id" element={<AwardsDetail />} />
                        <Route path="/legal/privacy-policy" element={<PrivacyNotice />} />
                        <Route path="/legal/cookie-policy" element={<CookieTerms />} />
                        <Route path="/legal/ecotourism-policy" element={<EcotourismNotice />} />
                        <Route path="/legal/wildlife-protection" element={<WildlifeProtection />} />
                        <Route path="/legal/terms-conditions" element={<TermsConditions />} />
                        <Route path="/legal/disclaimer" element={<Disclaimer />} />
                        <Route path="/legal/refund-policy" element={<RefundPolicy />} />
                    </Route>
                </Route>

                {/* Standalone full-page routes */}
                <Route path="*" element={<NotFound />} />
                <Route path="/access-denied" element={<AccessDenied />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/booking-suspended" element={<BookingSuspended />} />
            </Routes>
        </BrowserRouter>
    );
};

// Prevent HMR from calling createRoot repeatedly on the same DOM element
const container = document.getElementById('app');

if (container) {
    if (!window.__reactRoot) {
        window.__reactRoot = ReactDOM.createRoot(container);
    }

    window.__reactRoot.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}