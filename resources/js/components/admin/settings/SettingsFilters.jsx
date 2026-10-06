import { FileText, Globe2, History, Phone, SlidersHorizontal, Wrench } from 'lucide-react';

export const SETTINGS_SECTIONS = [
    { key: 'general', label: 'General', icon: Globe2 },
    { key: 'booking', label: 'Booking defaults', icon: SlidersHorizontal },
    { key: 'legal', label: 'Legal pages', icon: FileText },
    { key: 'utility', label: 'Utility pages', icon: Wrench },
    { key: 'contact', label: 'Contacts', icon: Phone },
    { key: 'audit', label: 'Audit trail', icon: History },
];

export default function SettingsFilters({ activeSection, onSectionChange }) {
    return (
        <nav aria-label="Settings sections" className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-1 shadow-xs">
            <div
                className="flex gap-1 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                role="tablist"
                aria-label="Settings categories"
            >
                {SETTINGS_SECTIONS.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.key;

                    return (
                        <button
                            key={section.key}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-controls="settings-panel"
                            onClick={() => onSectionChange(section.key)}
                            className={`cursor-pointer inline-flex h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive
                                ? 'bg-primary text-on-secondary'
                                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                                }`}
                        >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                            <span
                                className={`grid transition-all duration-300 ease-out sm:grid-cols-[1fr] sm:opacity-100 ${isActive
                                    ? 'grid-cols-[1fr] opacity-100'
                                    : 'grid-cols-[0fr] opacity-0 sm:opacity-100'
                                    }`}
                            >
                                <span className="overflow-hidden whitespace-nowrap">{section.label}</span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
