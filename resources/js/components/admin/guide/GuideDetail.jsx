import { useEffect, useRef } from 'react';
import {
    X, UserCheck, Mail, Phone, Calendar, Star, Mountain, Shield,
    ChevronRight, FileText, MapPin, Users, TrendingUp, Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDrawerTransition } from '@/hooks/useDrawerTransition';

function DetailSection({ title, children }) {
    return (
        <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{title}</p>
            <div className="mt-3">{children}</div>
        </div>
    );
}

function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-2.5 text-sm">
            <Icon className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-on-surface-variant">{label}</span>
            <span className="ml-auto text-right font-semibold text-on-surface">{value || 'Not provided'}</span>
        </div>
    );
}

function InfoCard({ icon: Icon, label, value, className = "" }) {
    return (
        <div className={`flex items-start gap-2.5 rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-3 transition-colors hover:bg-surface-container-low ${className}`}>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    {label}
                </p>
                <p className="mt-0.5 text-xs font-semibold leading-snug text-on-surface wrap-break-word">
                    {value || 'Not provided'}
                </p>
            </div>
        </div>
    );
}

function ActionButton({ icon: Icon, label, variant = 'outline', onClick }) {
    return (
        <Button variant={variant} onClick={onClick} className="w-full gap-2 cursor-pointer">
            <Icon className="h-4 w-4" />
            {label}
        </Button>
    );
}

const TRAIL_LABELS = {
    amtic: 'Amtic Trail (or Sabluyon Trail)',
    ligao: 'Balogo Trail',
};

const STATUS_CONFIG = {
    Active: { label: 'Active', text: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
    'On Leave': { label: 'On Leave', text: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
    Inactive: { label: 'Inactive', text: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' },
};

const CERT_CONFIG = {
    'DENR Accredited': { label: 'DENR Accredited', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    Provisional: { label: 'Provisional', text: 'text-amber-700', bg: 'bg-amber-50' },
};

export default function GuideDetail({ guide, onAction, onClose }) {
    const closeButtonRef = useRef(null);
    const { closing, requestClose, handleAnimationEnd } = useDrawerTransition(onClose);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') requestClose();
        };
        window.addEventListener('keydown', onKeyDown);
        closeButtonRef.current?.focus();
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [requestClose]);

    if (!guide) return null;

    const statusConfig = STATUS_CONFIG[guide.status] || STATUS_CONFIG.Active;
    const certConfig = CERT_CONFIG[guide.certification] || { label: guide.certification, text: 'text-on-surface-variant', bg: 'bg-surface-container-high' };

    const actions = [];

    if (guide.status === 'Active') {
        actions.push(
            { key: 'leave', label: 'Set On Leave', variant: 'outline', icon: Calendar, action: () => onAction('leave') }
        );
    }

    if (guide.status === 'On Leave') {
        actions.push(
            { key: 'activate', label: 'Reactivate Guide', variant: 'default', icon: UserCheck, action: () => onAction('activate') }
        );
    }

    if (guide.status !== 'Inactive') {
        actions.push(
            { key: 'deactivate', label: 'Deactivate', variant: 'destructive', icon: X, action: () => onAction('deactivate') }
        );
    }

    return (
        <div className="fixed inset-0 z-40">
            <div
                className={`absolute inset-0 bg-inverse-surface/60 ${closing ? 'animate-out fade-out animation-duration-300' : 'animate-in fade-in animation-duration-300'} motion-reduce:animate-none`}
                onClick={requestClose}
                aria-hidden="true"
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-label={`Guide ${guide.name}`}
                onAnimationEnd={closing ? handleAnimationEnd : undefined}
                className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface-container-lowest shadow-xl ${closing ? 'animate-out slide-out-to-right animation-duration-300' : 'animate-in slide-in-from-right animation-duration-300'} motion-reduce:animate-none`}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {guide.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-on-surface">{guide.name}</p>
                            <p className="truncate text-xs text-on-surface-variant">{guide.specialization}</p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
                            {statusConfig.label}
                        </span>
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={requestClose}
                            aria-label="Close guide details"
                            className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
                    {/* Contact Info */}
                    <DetailSection title="Contact">
                        <div className="space-y-2">
                            <DetailRow icon={Mail} label="Email" value={guide.email} />
                            <DetailRow icon={Phone} label="Phone" value={guide.phone} />
                            <DetailRow icon={MapPin} label="Emergency" value={guide.emergencyContact} />
                        </div>
                    </DetailSection>

                    {/* Credentials */}
                    <DetailSection title="Credentials">
                        <div className="grid grid-cols-2 gap-2.5">
                            <InfoCard icon={Shield} label="Certification" value={guide.certification} />
                            <InfoCard icon={Calendar} label="Accredited Since" value={guide.dateAccredited} />
                            <InfoCard icon={Star} label="Rating" value={`${guide.rating} / 5.0`} />
                            <InfoCard icon={Mountain} label="Total Climbs" value={String(guide.totalClimbs)} />
                        </div>
                    </DetailSection>

                    {/* Performance Stats */}
                    <DetailSection title="Performance">
                        <div className="grid grid-cols-2 gap-2.5">
                            <InfoCard icon={TrendingUp} label="Climbs" value={String(guide.assignedBookings ?? guide.totalClimbs ?? 0)} />
                            <InfoCard icon={Users} label="Hikers" value={String(guide.totalHikers ?? 0)} />
                            <InfoCard icon={Users} label="Avg Group" value={String(guide.avgGroupSize ?? 0)} />
                            <InfoCard icon={Wallet} label="Revenue" value={`₱${(guide.revenue ?? 0).toLocaleString()}`} />
                        </div>

                        {/* Utilization Bar */}
                        <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-on-surface-variant">Utilization</span>
                                <span className="font-semibold text-on-surface">{guide.utilization ?? 0}%</span>
                            </div>
                            <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-500"
                                    style={{ width: `${guide.utilization ?? 0}%` }}
                                />
                            </div>
                        </div>
                    </DetailSection>

                    {/* Assigned Trails */}
                    <DetailSection title="Assigned Trails">
                        <div className="space-y-2">
                            {(guide.assignedTrails || []).length > 0 ? (
                                guide.assignedTrails.map((trailId) => (
                                    <div
                                        key={trailId}
                                        className="flex items-center gap-2.5 rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-3"
                                    >
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <Mountain className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="text-xs font-semibold text-on-surface">
                                            {TRAIL_LABELS[trailId] || trailId}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-on-surface-variant">No trails assigned.</p>
                            )}
                        </div>
                    </DetailSection>

                    {/* Notes */}
                    {guide.notes && (
                        <DetailSection title="Notes">
                            <div className="rounded-2xl border border-outline-variant/40 p-4 text-sm leading-relaxed text-on-surface-variant">
                                <p>{guide.notes}</p>
                            </div>
                        </DetailSection>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-outline-variant/20 px-5 py-4">
                    {actions.length > 0 ? (
                        <div className={`grid gap-3 ${actions.length > 2 ? 'grid-cols-1' : actions.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {actions.map((action) => (
                                <ActionButton key={action.key} icon={action.icon} label={action.label} variant={action.variant} onClick={action.action} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-xs text-on-surface-variant">
                            This guide profile is inactive.
                        </p>
                    )}
                </div>
            </aside>
        </div>
    );
}
