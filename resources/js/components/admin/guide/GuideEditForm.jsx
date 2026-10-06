import { useEffect, useRef, useState } from 'react';
import {
    X, UserCheck, Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDrawerTransition } from '@/hooks/useDrawerTransition';

const SPECIALIZATION_OPTIONS = [
    'Summit Assault',
    'Eco-Trail & Flora/Fauna',
    'First Aid & Safety',
    'Beginner Groups',
    'Emergency Response',
];

const CERTIFICATION_OPTIONS = ['DENR Accredited', 'Provisional'];
const STATUS_OPTIONS = ['Active', 'On Leave', 'Inactive'];

const TRAIL_OPTIONS = [
    { value: 'amtic', label: 'Amtic Trail' },
    { value: 'ligao', label: 'Balogo Trail' },
];

export default function GuideEditForm({ guide, onClose, onSave }) {
    const closeButtonRef = useRef(null);
    const { closing, requestClose, handleAnimationEnd } = useDrawerTransition(onClose);
    const isNew = !guide?.id;

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        specialization: SPECIALIZATION_OPTIONS[0],
        certification: 'Provisional',
        status: 'Active',
        assignedTrails: [],
        dateAccredited: new Date().toISOString().split('T')[0],
        totalClimbs: 0,
        rating: 0,
        emergencyContact: '',
        notes: '',
    });

    useEffect(() => {
        if (guide) {
            setForm({
                name: guide.name || '',
                email: guide.email || '',
                phone: guide.phone || '',
                specialization: guide.specialization || SPECIALIZATION_OPTIONS[0],
                certification: guide.certification || 'Provisional',
                status: guide.status || 'Active',
                assignedTrails: guide.assignedTrails || [],
                dateAccredited: guide.dateAccredited || new Date().toISOString().split('T')[0],
                totalClimbs: guide.totalClimbs || 0,
                rating: guide.rating || 0,
                emergencyContact: guide.emergencyContact || '',
                notes: guide.notes || '',
            });
        }
    }, [guide]);

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

    const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const toggleTrail = (trailId) => {
        setForm((prev) => ({
            ...prev,
            assignedTrails: prev.assignedTrails.includes(trailId)
                ? prev.assignedTrails.filter((t) => t !== trailId)
                : [...prev.assignedTrails, trailId],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        onSave({
            ...guide,
            ...form,
        });
    };

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
                aria-label={isNew ? 'Add new guide' : `Edit guide ${form.name}`}
                onAnimationEnd={closing ? handleAnimationEnd : undefined}
                className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface-container-lowest shadow-xl ${closing ? 'animate-out slide-out-to-right animation-duration-300' : 'animate-in slide-in-from-right animation-duration-300'} motion-reduce:animate-none`}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            <UserCheck className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-on-surface">
                                {isNew ? 'New Guide' : 'Edit Guide'}
                            </p>
                            <p className="truncate text-xs text-on-surface-variant">
                                {isNew ? 'Add an accredited guide' : form.name}
                            </p>
                        </div>
                    </div>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={requestClose}
                        aria-label="Close guide form"
                        className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
                    {/* Personal Info */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Personal Info</p>
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Full Name *</label>
                            <Input
                                value={form.name}
                                onChange={(e) => update('name', e.target.value)}
                                placeholder="e.g. Juan Dela Cruz"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Email</label>
                                <Input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => update('email', e.target.value)}
                                    placeholder="guide@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Phone</label>
                                <Input
                                    value={form.phone}
                                    onChange={(e) => update('phone', e.target.value)}
                                    placeholder="+63 917 000 0000"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Emergency Contact</label>
                            <Input
                                value={form.emergencyContact}
                                onChange={(e) => update('emergencyContact', e.target.value)}
                                placeholder="+63 917 000 0000"
                            />
                        </div>
                    </div>

                    {/* Credentials */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Credentials</p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Specialization</label>
                                <select
                                    value={form.specialization}
                                    onChange={(e) => update('specialization', e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-lg text-sm font-medium bg-surface border border-outline-variant text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-150"
                                >
                                    {SPECIALIZATION_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Certification</label>
                                <select
                                    value={form.certification}
                                    onChange={(e) => update('certification', e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-lg text-sm font-medium bg-surface border border-outline-variant text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-150"
                                >
                                    {CERTIFICATION_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Status</label>
                                <select
                                    value={form.status}
                                    onChange={(e) => update('status', e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-lg text-sm font-medium bg-surface border border-outline-variant text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-150"
                                >
                                    {STATUS_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Date Accredited</label>
                                <Input
                                    type="date"
                                    value={form.dateAccredited}
                                    onChange={(e) => update('dateAccredited', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Assigned Trails */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Assigned Trails</p>
                        <div className="flex flex-wrap gap-2">
                            {TRAIL_OPTIONS.map((trail) => (
                                <button
                                    key={trail.value}
                                    type="button"
                                    onClick={() => toggleTrail(trail.value)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer whitespace-nowrap ${form.assignedTrails.includes(trail.value)
                                        ? 'bg-primary text-white shadow-xs'
                                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                                        }`}
                                >
                                    {trail.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Notes</p>
                        <textarea
                            value={form.notes}
                            onChange={(e) => update('notes', e.target.value)}
                            placeholder="Additional notes about this guide..."
                            rows={3}
                            className="w-full px-3.5 py-2.5 rounded-lg text-sm font-medium bg-surface border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-150 resize-none"
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="border-t border-outline-variant/20 px-5 py-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            onClick={requestClose}
                            className="gap-2 cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            onClick={handleSubmit}
                            className="gap-2 cursor-pointer"
                        >
                            <Save className="h-4 w-4" />
                            {isNew ? 'Add Guide' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </aside>
        </div>
    );
}
