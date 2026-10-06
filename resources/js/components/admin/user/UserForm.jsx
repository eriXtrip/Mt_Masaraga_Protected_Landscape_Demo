import React, { useState, useEffect, useRef } from 'react';
import { X, Save, CalendarCheck, Wallet, Mountain, UserCheck, Newspaper, Megaphone, BarChart3, Shield, KeyRound, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDrawerTransition } from '@/hooks/useDrawerTransition';
import { toast } from '@/components/ui/toast';
import {
    getPasswordRequirements,
    isPasswordValid,
    isValidPin,
    MIN_PASSWORD_LENGTH,
    MIN_PIN_LENGTH,
    MAX_PIN_LENGTH,
} from '@/lib/passwordRules';

const ROLE_OPTIONS = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Staff / Guide' },
    { value: 3, label: 'Hiker' },
];

const STATUS_OPTIONS = ['Active', 'Inactive'];

const PERMISSION_OPTIONS = [
    { key: 'bookings', label: 'Bookings', icon: CalendarCheck },
    { key: 'trails', label: 'Trails', icon: Mountain },
    { key: 'guides', label: 'Guides', icon: UserCheck },
    { key: 'payments', label: 'Payments', icon: Wallet },
    { key: 'content', label: 'Content', icon: Newspaper },
    { key: 'announcements', label: 'Announcements', icon: Megaphone },
    { key: 'reports', label: 'Reports', icon: BarChart3 },
];

const EMPTY_FORM = {
    name: '',
    email: '',
    role: 3,
    status: 'Active',
    subtitle: '',
    permissions: [],
};

const EMPTY_CREDENTIALS = {
    password: '',
    passwordConfirm: '',
    secondaryPin: '',
    secondaryPinConfirm: '',
};

const LABEL_CLASS = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant';

function Field({ id, label, children, hint }) {
    return (
        <div>
            <label htmlFor={id} className={LABEL_CLASS}>{label}</label>
            {children}
            {hint && <p className="mt-1.5 text-[11px] text-on-surface-variant/80">{hint}</p>}
        </div>
    );
}

function SecretInput({ id, label, revealed, onToggle, value, onChange, ...props }) {
    return (
        <div className="relative">
            <Input
                id={id}
                type={revealed ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                className="pr-10"
                {...props}
            />
            <button
                type="button"
                onClick={onToggle}
                aria-label={revealed ? `Hide ${label}` : `Show ${label}`}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded p-1 text-on-surface-variant transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
                {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
    );
}

export default function UserForm({ user, onSave, onClose }) {
    const closeButtonRef = useRef(null);
    const { closing, requestClose, handleAnimationEnd } = useDrawerTransition(onClose);
    const isEditing = !!user?.id;

    const [form, setForm] = useState(() => {
        if (user) {
            return {
                name: user.name || '',
                email: user.email || '',
                role: user.role ?? 3,
                status: user.status || 'Active',
                subtitle: user.subtitle || '',
                permissions: user.permissions || [],
            };
        }
        return EMPTY_FORM;
    });

    const [credentials, setCredentials] = useState(EMPTY_CREDENTIALS);
    const [revealed, setRevealed] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // A <select> always hands back a string, so the role is normalised before it
    // is compared or saved.
    const role = Number(form.role);
    const isAdmin = role === 1;
    const missingRequirements = getPasswordRequirements(credentials.password);

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

    const setField = (key) => (e) => setForm((c) => ({ ...c, [key]: e.target.value }));

    const setCredential = (key) => (e) => setCredentials((c) => ({ ...c, [key]: e.target.value }));

    const setPin = (key) => (e) => setCredentials((c) => ({
        ...c,
        [key]: e.target.value.replace(/\D/g, '').slice(0, MAX_PIN_LENGTH),
    }));

    const toggleReveal = (key) => setRevealed((c) => ({ ...c, [key]: !c[key] }));

    const togglePermission = (key) => {
        setForm((c) => ({
            ...c,
            permissions: c.permissions.includes(key)
                ? c.permissions.filter((p) => p !== key)
                : [...c.permissions, key],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim()) {
            toast.add({ type: 'error', title: 'Validation error', description: 'Name and email are required.' });
            return;
        }

        const { password, passwordConfirm, secondaryPin, secondaryPinConfirm } = credentials;
        // Editing leaves the stored password and PIN alone unless a new one is typed.
        const mustSetPassword = !isEditing || password.length > 0;
        const mustSetPin = isAdmin && (!user?.secondaryPin || secondaryPin.length > 0);

        if (mustSetPassword) {
            if (!isPasswordValid(password)) {
                toast.add({ type: 'error', title: 'Password too weak', description: `Use at least ${MIN_PASSWORD_LENGTH} characters with an uppercase letter, a lowercase letter, a number, and a special character.` });
                return;
            }
            if (password !== passwordConfirm) {
                toast.add({ type: 'error', title: 'Passwords do not match', description: 'Retype the password so both entries are identical.' });
                return;
            }
        }

        if (mustSetPin) {
            if (!isValidPin(secondaryPin)) {
                toast.add({ type: 'error', title: 'Invalid secondary PIN', description: `The secondary PIN must be 4 to ${MAX_PIN_LENGTH} digits.` });
                return;
            }
            if (secondaryPin !== secondaryPinConfirm) {
                toast.add({ type: 'error', title: 'PINs do not match', description: 'Retype the secondary PIN so both entries are identical.' });
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const data = {
                ...form,
                role,
                id: user?.id ?? `user_${Date.now()}`,
                subtitle: form.subtitle,
            };

            if (mustSetPassword) {
                data.password = password;
            }
            data.secondaryPin = isAdmin ? (secondaryPin || user?.secondaryPin || '') : null;

            onSave(data, isEditing ? user.id : null);
            toast.add({ type: 'success', title: isEditing ? 'User updated' : 'User created', description: isEditing ? 'Changes have been saved.' : 'The user has been added.' });
            requestClose();
        } catch (error) {
            toast.add({ type: 'error', title: 'Error', description: 'Failed to save user.' });
        } finally {
            setIsSubmitting(false);
        }
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
                aria-label={isEditing ? 'Edit user' : 'Create user'}
                onAnimationEnd={closing ? handleAnimationEnd : undefined}
                className={`absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col bg-surface-container-lowest shadow-xl ${closing ? 'animate-out slide-out-to-right animation-duration-300' : 'animate-in slide-in-from-right animation-duration-300'} motion-reduce:animate-none`}
            >
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{isEditing ? 'Edit' : 'Create'} User</p>
                        <h2 className="mt-1 text-lg font-bold text-on-surface">{isEditing ? 'Update user' : 'New user'}</h2>
                    </div>
                    <button ref={closeButtonRef} type="button" onClick={requestClose} aria-label="Close" className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                    <Field id="user-name" label="Full Name">
                        <Input id="user-name" value={form.name} onChange={setField('name')} required placeholder="Full name" />
                    </Field>
                    <Field id="user-email" label="Email">
                        <Input id="user-email" type="email" value={form.email} onChange={setField('email')} required placeholder="email@example.com" />
                    </Field>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field id="user-role" label="Role">
                            <select id="user-role" value={form.role} onChange={setField('role')} className="w-full rounded-lg border border-outline-variant bg-surface px-3.5 py-2.5 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer">
                                {ROLE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </Field>
                        <Field id="user-status" label="Status">
                            <select id="user-status" value={form.status} onChange={setField('status')} className="w-full rounded-lg border border-outline-variant bg-surface px-3.5 py-2.5 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer">
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </Field>
                    </div>
                    <Field id="user-subtitle" label="Subtitle / Title">
                        <Input id="user-subtitle" value={form.subtitle} onChange={setField('subtitle')} placeholder="e.g., Park Staff / Guide" />
                    </Field>

                    <div className="space-y-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5">
                        <div className="flex items-center gap-2">
                            <KeyRound className="h-4 w-4 text-primary" />
                            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Account Security</p>
                        </div>
                        <p className="text-xs text-on-surface-variant">
                            {isEditing
                                ? 'Leave these blank to keep the credentials already on file.'
                                : 'Set the password this account signs in with.'}
                        </p>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field id="user-password" label={isEditing ? 'New Password' : 'Password'}>
                                <SecretInput
                                    id="user-password"
                                    label="password"
                                    revealed={!!revealed.password}
                                    onToggle={() => toggleReveal('password')}
                                    value={credentials.password}
                                    onChange={setCredential('password')}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                />
                            </Field>
                            <Field id="user-password-confirm" label="Confirm Password">
                                <SecretInput
                                    id="user-password-confirm"
                                    label="password confirmation"
                                    revealed={!!revealed.passwordConfirm}
                                    onToggle={() => toggleReveal('passwordConfirm')}
                                    value={credentials.passwordConfirm}
                                    onChange={setCredential('passwordConfirm')}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                />
                            </Field>
                        </div>
                        {credentials.password && (
                            missingRequirements.length === 0 ? (
                                <p className="text-[11px] font-medium text-primary">All password requirements met</p>
                            ) : (
                                <p className="text-[11px] text-on-surface-variant/80">
                                    Must include: <span className="font-medium text-outline">{missingRequirements.join(', ')}</span>
                                </p>
                            )
                        )}

                        {isAdmin && (
                            <>
                                <p className="border-t border-outline-variant/20 pt-4 text-[11px] text-on-surface-variant/80">
                                    Admins also confirm a secondary PIN at sign-in. {MIN_PIN_LENGTH} to {MAX_PIN_LENGTH} digits.
                                </p>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <Field id="user-pin" label="Secondary PIN">
                                        <SecretInput
                                            id="user-pin"
                                            label="secondary PIN"
                                            revealed={!!revealed.secondaryPin}
                                            onToggle={() => toggleReveal('secondaryPin')}
                                            value={credentials.secondaryPin}
                                            onChange={setPin('secondaryPin')}
                                            inputMode="numeric"
                                            maxLength={MAX_PIN_LENGTH}
                                            autoComplete="off"
                                            placeholder="••••••"
                                        />
                                    </Field>
                                    <Field id="user-pin-confirm" label="Confirm PIN">
                                        <SecretInput
                                            id="user-pin-confirm"
                                            label="PIN confirmation"
                                            revealed={!!revealed.secondaryPinConfirm}
                                            onToggle={() => toggleReveal('secondaryPinConfirm')}
                                            value={credentials.secondaryPinConfirm}
                                            onChange={setPin('secondaryPinConfirm')}
                                            inputMode="numeric"
                                            maxLength={MAX_PIN_LENGTH}
                                            autoComplete="off"
                                            placeholder="••••••"
                                        />
                                    </Field>
                                </div>
                            </>
                        )}
                    </div>

                    {role === 2 && (
                        <div className="space-y-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Role-Based Access Control</p>
                            </div>
                            <p className="text-xs text-on-surface-variant">Select modules this Staff / Guide can access.</p>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {PERMISSION_OPTIONS.map((perm) => (
                                    <button
                                        key={perm.key}
                                        type="button"
                                        onClick={() => togglePermission(perm.key)}
                                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors cursor-pointer ${form.permissions.includes(perm.key)
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-outline-variant bg-surface text-on-surface-variant hover:border-primary/50 hover:text-on-surface'
                                            }`}
                                    >
                                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${form.permissions.includes(perm.key)
                                            ? 'bg-primary border-primary text-white'
                                            : 'border-outline-variant bg-surface'
                                            }`}>
                                            {form.permissions.includes(perm.key) && (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                        </div>
                                        <perm.icon className="h-4 w-4 shrink-0 opacity-60" />
                                        <span className="text-xs font-semibold">{perm.label}</span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-on-surface-variant">
                                {form.permissions.length} module{form.permissions.length !== 1 ? 's' : ''} selected
                            </p>
                        </div>
                    )}
                </form>

                <div className="border-t border-outline-variant/20 px-5 py-4 flex items-center justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={requestClose} className="cursor-pointer" disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" className="gap-2 cursor-pointer" disabled={isSubmitting}>
                        <Save className="h-4 w-4" />
                        {isEditing ? 'Save Changes' : 'Create User'}
                    </Button>
                </div>
            </aside>
        </div>
    );
}
