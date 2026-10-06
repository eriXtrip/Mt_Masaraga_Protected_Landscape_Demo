import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { LEGAL_PAGES } from '../../mockData';
import {
    resetSettings,
    updateSettings,
    updateSettingItem,
    useAdminStore,
} from '../../state/adminStore';
import {
    SettingsFilters,
    SettingsForm,
    SettingsList,
    SettingsSummary,
} from '../../components/admin/settings';

export default function AdminSettings() {
    const { profile, settings = {}, auditLog = [] } = useAdminStore();
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const [activeSection, setActiveSection] = useState('general');
    const [editing, setEditing] = useState(null);
    const currentLegalPages = settings.legal && Object.keys(settings.legal).length > 0 ? settings.legal : LEGAL_PAGES;
    const displaySettings = { ...settings, legal: currentLegalPages };

    const handleEdit = (item) => {
        const groupSettings = displaySettings[item.group] || {};
        const value = item.itemKey ? groupSettings[item.itemKey] : groupSettings;
        setEditing({ ...item, value });
    };

    const handleSave = (form) => {
        const actor = profile?.name || 'Admin';

        if (editing.itemKey) {
            updateSettingItem(editing.group, editing.itemKey, form, actor);
        } else {
            updateSettings(editing.group, form, actor);
        }

        toast.add({
            type: 'success',
            title: 'Settings saved',
            description: 'The public site settings were updated for this admin session.',
        });
        setEditing(null);
    };

    const handleReset = () => {
        const confirmed = window.confirm('Reset all site settings to their seeded defaults?');
        if (!confirmed) return;

        resetSettings(profile?.name || 'Admin');
        setEditing(null);
        toast.add({
            type: 'success',
            title: 'Settings restored',
            description: 'All configurable site settings are back to their defaults.',
        });
    };

    return (
        <>
            <div ref={sectionRef} className="space-y-6 md:space-y-8">
                <header
                    style={{ transitionDelay: '0ms' }}
                    className={`flex flex-col gap-3 md:flex-row md:items-end md:justify-between transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
                >
                    <div className="max-w-2xl space-y-1.5">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Admin Console · Settings</p>
                        <h1 className="text-2xl font-bold tracking-tight text-on-surface md:text-3xl">Site Settings</h1>
                        <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">
                            Manage public-facing legal pages, utility notices, booking defaults, contact channels, and the settings audit trail.
                        </p>
                    </div>
                    <Button type="button" variant="outline" size="lg" className="h-11! shrink-0 gap-2" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4" aria-hidden="true" />
                        Reset defaults
                    </Button>
                </header>

                <div
                    style={{ transitionDelay: '150ms' }}
                    className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
                >
                    <SettingsSummary settings={displaySettings} auditLog={auditLog} />
                </div>

                <div
                    style={{ transitionDelay: '300ms' }}
                    className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
                >
                    <SettingsFilters activeSection={activeSection} onSectionChange={setActiveSection} />
                </div>

                <div
                    style={{ transitionDelay: '450ms' }}
                    className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
                >
                    <SettingsList activeSection={activeSection} settings={displaySettings} auditLog={auditLog} onEdit={handleEdit} />
                </div>
            </div>

            {editing && (
                <SettingsForm
                    key={`${editing.group}-${editing.itemKey || 'root'}`}
                    section={editing.group}
                    itemKey={editing.itemKey}
                    value={editing.value}
                    onSave={handleSave}
                    onClose={() => setEditing(null)}
                />
            )}
        </>
    );
}
