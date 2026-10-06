import { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { Link, useNavigate } from 'react-router-dom';
import Mountain from '../../components/icons/Mountain';
import Hiking from '../../components/icons/Hiking';
import { ArrowRight, Eye, EyeOff, ShieldCheck, Mail } from 'lucide-react';
import MtMasaraga from '../../../../public/images/loginSignup/mt-masaraga-hero.jpg';
import { Button } from "@/components/ui/button";
import AdminAuthModal from '../../components/features/AdminAuthModal';
import { MOCK_USERS } from '../../mockData';
import { toast } from '../../components/ui/toast';

export default function Login() {
    const navigate = useNavigate();
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const [form, setForm] = useState({
        email: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    // Modal state
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [pendingUser, setPendingUser] = useState(null);

    const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Find user match from MOCK_USERS by email (fallback to admin user if unmatched for easy testing)
        const matchedUser = MOCK_USERS.find(
            (u) => u.email?.toLowerCase() === form.email.toLowerCase()
        ) || MOCK_USERS[0];

        // 2. Intercept and open modal if Role is 1 (Admin)
        if (matchedUser && matchedUser.role === 1) {
            setPendingUser(matchedUser);
            setShowAdminModal(true);
            return;
        }

        // 3. Standard user login flow
        completeLogin(matchedUser);
    };

    const handleAdminConfirm = (secondaryPin) => {
        setShowAdminModal(false);
        toast.add({ type: 'success', title: 'Admin verified. Redirecting to dashboard...' });
        setTimeout(() => completeLogin(pendingUser), 500);
    };

    const completeLogin = (user) => {
        if (!user) return;

        localStorage.setItem('currentUser', JSON.stringify(user));

        if (user.role === 1) {
            window.location.assign('/admin/dashboard');
            return;
        }

        if (user.role === 2) {
            window.location.assign('/staff/dashboard');
            return;
        }

	if (user.role === 3) {
            window.location.assign('/hiker/dashboard');
            return;
        }

        toast.add({ type: 'success', title: 'Login successful', description: 'Welcome back!' });
        navigate('/');
    };

    return (
        <div ref={sectionRef} className="relative flex min-h-dvh w-full flex-col bg-surface text-on-surface lg:flex-row overflow-hidden">

            {/* Standalone Admin Modal Component */}
            <AdminAuthModal
                isOpen={showAdminModal}
                onClose={() => setShowAdminModal(false)}
                user={pendingUser}
                onConfirm={handleAdminConfirm}
            />

            {/* Left Side: Hero Image (Slides in from Left) */}
            <div
                className={`hidden w-full shrink-0 bg-cover bg-center bg-surface-variant lg:flex lg:w-[42%] xl:w-[40%] relative flex-col justify-end p-12 transition-all duration-1000 ease-out ${isInView
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-16 lg:-translate-x-24'
                    }`}
            >
                <img
                    src={MtMasaraga}
                    alt="Mt. Masaraga covered in lush green rainforest piercing through morning mist"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-linear-to-t from-inverse-surface/90 via-inverse-surface/40 to-transparent" />
                <div className="relative z-10 mb-12 flex max-w-lg flex-col gap-4">
                    <div className="flex items-center gap-2 text-white">
                        <Mountain className="h-10 w-15" />
                        <span className="text-headline-md font-bold tracking-tight">
                            Mt. Masaraga PL
                        </span>
                    </div>
                    <p className="leading-relaxed text-body-lg text-white/90">
                        Welcome back to the Mt. Masaraga PL. Sign in to access your registered trail permits, check scheduled climbs, coordinate with accredited guides, and view your verified hiker credentials.
                    </p>
                    <div className="mt-2 flex items-center gap-4 border-t border-white/20 pt-4 text-xs text-white/80">
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="h-4.5 w-4.5" />
                            <span>DENR-PASu Certified</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Hiking className="h-4.5 w-4.5" />
                            <span>Eco-Hiker Network</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form (Slides in from Right) */}
            <div
                style={{ transitionDelay: '150ms' }}
                className={`flex min-h-dvh w-full flex-col justify-between overflow-y-auto bg-transparent p-0 sm:bg-surface-container-lowest sm:p-10 md:p-14 lg:w-[58%] lg:p-16 xl:w-[60%] transition-all duration-1000 ease-out ${
                    isInView
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-100 sm:opacity-0 translate-x-0 sm:translate-x-16 lg:translate-x-24'
                }`}
            >
                <img
                    src={MtMasaraga}
                    alt="Mt. Masaraga covered in lush green rainforest piercing through morning mist"
                    className="absolute inset-0 w-full h-full object-cover object-top sm:hidden block"
                />

                {/* Gradient Scrim for Contrast & Atmosphere */}
                <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/20 to-transparent sm:hidden block" />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-black/20 lg:to-black/20 sm:hidden block" />

                <div className="flex flex-col flex-1 max-w-md w-full mx-auto pt-5 sm:pb-12 justify-between sm:justify-start">
                    {/* Header - Downward animation on mobile */}
                    <div
                        className={`sm:mt-0 mt-30 transform transition-all duration-700 ease-out sm:transform-none ${
                            isInView
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 -translate-y-12 sm:opacity-100 sm:translate-y-0'
                        }`}
                    >
                        <div className="mb-8 text-center md:text-left px-6">
                            <h2 className="text-2xl font-bold sm:text-on-surface text-white">
                                Welcome Back
                            </h2>
                            <p className="font-body-md text-body-md sm:text-on-surface-variant text-white">
                                Log in to manage your bookings.
                            </p>
                        </div>
                    </div>

                    {/* Form Area - Upward animation on mobile */}
                    <div
                        className={`flex flex-col justify-between flex-1 sm:flex-initial sm:mt-0 mt-13 p-6 sm:px-1 pb-6 bg-surface-container-lowest sm:bg-transparent shadow-lg sm:shadow-none rounded-t-3xl border-t sm:border-none border-outline-variant/30 sm:rounded-b-3xl transform transition-all duration-700 ease-out sm:transform-none ${
                            isInView
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-full sm:opacity-100 sm:translate-y-0'
                        }`}
                    >
                        <form onSubmit={handleSubmit} className="space-y-6 sm:px-6 px-0">
                            <div>
                                <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) => update('email', e.target.value)}
                                        placeholder="admin@masaraga.gov.ph"
                                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2 pl-9 pr-3 text-body-sm text-on-surface placeholder:text-outline transition-all focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">
                                        Password
                                    </label>
                                    <a className="font-label-md text-label-md text-primary hover:underline" href="/forgot-password">
                                        Forgot Password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={form.password}
                                        onChange={(e) => update('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 pr-10 text-body-sm text-on-surface placeholder:text-outline transition-all focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors hover:text-on-surface focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={form.remember}
                                    onChange={(e) => update('remember', e.target.checked)}
                                    className="h-4 w-4 cursor-pointer rounded border-outline-variant bg-surface-container-lowest text-primary transition-colors focus:ring-primary focus:ring-offset-surface"
                                />
                                <label className="ml-3 font-body-sm text-body-sm text-on-surface-variant cursor-pointer" htmlFor="remember">
                                    Remember Me
                                </label>
                            </div>

                            <Button
                                type="submit"
                                variant="default"
                                size="lg"
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-md font-semibold text-on-secondary shadow-sm transition-colors hover:bg-surface-tint cursor-pointer"
                            >
                                <span>Login</span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </form>

                        {/* Sign Up Redirect */}
                        <div className="text-center mt-6">
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                Don't have an account yet?
                                <Link
                                    to="/signup"
                                    className="font-label-md text-label-md text-primary hover:underline ml-1 font-semibold"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}