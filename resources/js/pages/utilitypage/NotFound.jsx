import React from 'react';
import { useLottie } from 'lottie-react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Compass,
  Ticket,
  FileText,
  Map,
  Phone,
  Home
} from 'lucide-react';
import ChicamontaaAnimation from '../../components/lottiefiles/chicamontaa.json';
import { Button } from '../../components/ui/button';
import { useAdminStore } from '../../state/adminStore';

// Helper component using the hook API to bypass React 19 default export issues
const LottiePlayer = ({ animationData, loop = true, className = '' }) => {
  const options = {
    animationData,
    loop,
    autoplay: true,
  };

  const { View } = useLottie(options);

  return <div className={className}>{View}</div>;
};

const DESTINATIONS = [
  {
    icon: Ticket,
    title: 'Book a Hiking Permit',
    desc: 'Reserve official climbing slots & schedules',
    to: '/booking'
  },
  {
    icon: FileText,
    title: 'Mandatory Requirements',
    desc: 'Health certificates & barangay clearances',
    to: '/help'
  },
  {
    icon: Map,
    title: 'Trail Guides & Maps',
    desc: 'Explore authorized routes on Mt. Masaraga',
    to: '/trail'
  },
  {
    icon: Phone,
    title: 'Contact Ranger Support',
    desc: 'Reach out for inquiries or trail hazards',
    to: '/contact'
  }
];

export default function NotFound() {
  const navigate = useNavigate();
  const { settings } = useAdminStore();
  const notFoundSettings = settings?.utility?.notFound || {};

  return (
    <main className="h-full w-full bg-surface px-6 py-8 md:px-12 lg:px-16 font-sans flex flex-col justify-between">
      <div className="mx-auto w-full max-w-6xl space-y-8">

        {/* Top Navigation / Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Previous Page</span>
          </button>
        </nav>

        {/* Two-Column Responsive Layout Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:justify-center lg:gap-12 pt-10 place-items-center">

          {/* Column 1: Lottie Animation Hero */}
          <div className="flex justify-center lg:col-span-5 w-full">
            <div className="relative h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96">
              <div className="absolute inset-0 rounded-full bg-primary/40 blur-3xl" />
              <LottiePlayer
                animationData={ChicamontaaAnimation}
                loop={true}
                className="relative z-10 h-full w-full object-contain"
              />
            </div>
          </div>

          {/* Column 2: Content, Search, Actions & Suggested Destinations */}
          <div className="space-y-8 lg:col-span-7 text-center lg:text-left w-full">

            {/* Header Messaging */}
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Compass className="h-4 w-4" />
                <span>Wayfinding Assistance</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-on-surface">
                {notFoundSettings.title || "You've Wandered Off the Trail!"}
              </h1>
              <p className="text-sm md:text-base text-on-surface-variant leading-relaxed max-w-xl mx-auto lg:mx-0">
                {notFoundSettings.message || 'The page or route you are searching for is unavailable.'}
              </p>
            </div>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Button
                variant="default"
                size="lg"
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 font-bold cursor-pointer rounded-xl px-6 py-5"
              >
                <Home className="h-4 w-4" />
                <span>Back to Trailhead</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/contact')}
                className="font-bold cursor-pointer rounded-xl border-outline-variant/40 text-on-surface hover:bg-surface-container-low px-4 py-5"
              >
                Report Broken Link
              </Button>
            </div>

            {/* Suggested Destinations Grid */}
            <div className="pt-6 border-t border-outline-variant/30 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-outline">
                Suggested Destinations
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {DESTINATIONS.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.title}
                      to={item.to}
                      className="group flex items-start gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-3.5 shadow-xs transition-all hover:border-primary/40 hover:bg-surface-container-low/50 text-left"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-0.5 text-[11px] text-on-surface-variant leading-tight">
                          {item.desc}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}