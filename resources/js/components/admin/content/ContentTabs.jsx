import React from 'react';
import { Newspaper, Award, Image, Mountain, HelpCircle } from 'lucide-react';

export default function ContentTabs({ activeTab, onTabChange }) {
    const tabs = [
        { key: 'news', label: 'News & Advisories', icon: Newspaper },
        { key: 'awards', label: 'Awards', icon: Award },
        { key: 'gallery', label: 'Gallery', icon: Image },
        { key: 'about', label: 'About', icon: Mountain },
        { key: 'faq', label: 'FAQ', icon: HelpCircle },
    ];

    return (
        <div className="flex items-center gap-1 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-1 shadow-xs">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => onTabChange(tab.key)}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${isActive
                            ? 'bg-primary text-white shadow-xs'
                            : 'text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                    >
                        <Icon className="h-4 w-4" />
                        <span
                            className={`grid transition-all duration-300 ease-out sm:grid-cols-[1fr] sm:opacity-100 ${isActive
                                    ? 'grid-cols-[1fr] opacity-100'
                                    : 'grid-cols-[0fr] opacity-0 sm:opacity-100'
                                }`}
                        >
                            <span className="overflow-hidden whitespace-nowrap">{tab.label}</span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
