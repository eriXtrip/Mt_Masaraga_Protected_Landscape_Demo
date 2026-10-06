import React, { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { useHikerStore, updateProfile } from '../../state/hikerStore';
import { toast } from '../../components/ui/toast';
import {
    ProfileSidebar,
    PersonalInfoForm,
    EmergencyContactForm,
} from '../../components/hiker/profile';

export default function Profile() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const { profile, transactions } = useHikerStore();

    const activePassCount = transactions
        .flatMap((txn) => txn.passesData)
        .filter((pass) => pass.status === 'Valid').length;

    const [form, setForm] = useState({
        name: profile.name,
        email: profile.email,
        mobile: profile.mobile,
        emergencyName: profile.emergencyContact.name,
        emergencyRelation: profile.emergencyContact.relation,
        emergencyMobile: profile.emergencyContact.mobile,
    });

    const setField = (key) => (event) =>
        setForm((current) => ({ ...current, [key]: event.target.value }));
    const handleSave = (event) => {
        event.preventDefault();
        updateProfile({
            name: form.name.trim(),
            email: form.email.trim(),
            mobile: form.mobile.trim(),
            emergencyContact: {
                name: form.emergencyName.trim(),
                relation: form.emergencyRelation.trim(),
                mobile: form.emergencyMobile.trim(),
            },
        });
        toast.add({ type: 'success', title: 'Profile updated', description: 'Your details have been saved.' });
    };

    return (
        <div ref={sectionRef} className="min-h-dvh bg-surface font-sans">
            <div className={`max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                <header className="mb-8">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-primary">My Profile</p>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mt-2">Account Settings</h1>
                    <p className="text-sm md:text-base text-on-surface-variant mt-2 max-w-2xl">
                        Keep your personal and emergency contact details up to date. These stay with your bookings.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <ProfileSidebar
                        name={form.name}
                        email={form.email}
                        transactionCount={transactions.length}
                        activePassCount={activePassCount}
                    />

                    <div className="lg:col-span-2 space-y-6">
                        <PersonalInfoForm
                            form={form}
                            onFieldChange={setField}
                        />

                        <EmergencyContactForm
                            form={form}
                            onFieldChange={setField}
                            onSave={handleSave}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
