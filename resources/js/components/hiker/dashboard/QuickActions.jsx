import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mountain, Ticket, MessageCircle, UserRound } from 'lucide-react';
import { ADMIN_SETTINGS } from '../../../mockData';

const MESSENGER_URL = ADMIN_SETTINGS.contact.facebook;

const QUICK_ACTIONS = [
    { label: 'Book a New Hike', desc: 'Reserve a slot on a trail', to: '/booking', icon: Mountain },
    { label: 'My Digital Passes', desc: 'View and download your e-passes', to: '/hiker/passes', icon: Ticket },
    { label: 'Message Park Staff', desc: 'Reach the guides on Messenger', href: MESSENGER_URL, icon: MessageCircle },
    { label: 'My Profile', desc: 'Keep your account details current', to: '/hiker/profile', icon: UserRound },
];

export default function QuickActions() {
    const navigate = useNavigate();

    return (
        <section>
            <div className="flex items-center gap-2 mb-4">
                <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Quick Actions</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {QUICK_ACTIONS.map((action) => {
                    const Icon = action.icon;
                    const className = "group bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 text-left shadow-xs transition-all hover:border-primary/50 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer";
                    const body = (
                        <>
                            <span className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-on-primary">
                                <Icon className="h-5 w-5" />
                            </span>
                            <span className="block mt-4 text-sm font-bold text-on-surface transition-colors group-hover:text-primary">
                                {action.label}
                            </span>
                            <span className="block mt-1 text-xs text-on-surface-variant leading-relaxed">
                                {action.desc}
                            </span>
                        </>
                    );

                    if (action.href) {
                        return (
                            <a
                                key={action.label}
                                href={action.href}
                                target="_blank"
                                rel="noreferrer noopener"
                                className={className}
                            >
                                {body}
                            </a>
                        );
                    }

                    return (
                        <button
                            key={action.label}
                            type="button"
                            onClick={() => navigate(action.to)}
                            className={className}
                        >
                            {body}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
