import React, { useState, useEffect } from 'react';
import { User, PhoneCall, Stethoscope, Scale, ChevronDown, CheckCircle2, AlertCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';

import { HEALTH_QUESTIONS } from '../../mockData';

const EMERGENCY_RELATIONSHIPS = [
    'Spouse',
    'Parent',
    'Sibling',
    'Child',
    'Relative',
    'Friend',
    'Guardian',
];

const emptyHiker = () => ({
    fullName: '',
    dateOfBirth: '',
    address: '',
    // Where the confirmation, e-passes, and booking reference are delivered. Only the
    // lead hiker is asked for it; companions inherit the lead's inbox.
    email: '',
    emergencyName: '',
    emergencyRelationship: '',
    emergencyContact: '',
    shareEmergencyContact: true,
    healthAnswers: {
        health1: '',
        health2: '',
        health3: '',
        health4: '',
        health5: '',
        health6: '',
    },
    agreeWaiver: false,
});

// Deliberately loose: the browser's own type=email validation and server-side
// verification remain the real checks, this only blocks obvious typos at submit.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const isDeliverableEmail = (value = '') => EMAIL_PATTERN.test(value.trim());

const areHealthAnswersComplete = (healthAnswers) =>
    HEALTH_QUESTIONS.every((question) => Boolean(healthAnswers[question.id]));

const areAllHealthAnswersNo = (healthAnswers) =>
    HEALTH_QUESTIONS.every((question) => healthAnswers[question.id] === 'no');

export default function HikerDetailsForm({ participantCount = 1, onBack, onNext }) {
    const [formDataArray, setFormDataArray] = useState(() => Array.from({ length: participantCount }, emptyHiker));
    const [openHikerIndex, setOpenHikerIndex] = useState(0);

    const toggleHiker = (index) => {
        setOpenHikerIndex((prev) => (prev === index ? null : index));
    };

    useEffect(() => {
        setFormDataArray((prev) => {
            if (prev.length === participantCount) return prev;
            if (participantCount > prev.length) {
                return [...prev, ...Array.from({ length: participantCount - prev.length }, emptyHiker)];
            }
            return prev.slice(0, participantCount);
        });
    }, [participantCount]);

    const updateHiker = (index, patch) => {
        setFormDataArray((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], ...patch };
            return next;
        });
    };

    const handleInputChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        updateHiker(index, { [name]: type === 'checkbox' ? checked : value });
    };

    const handleHealthChange = (index, questionId, value) => {
        setFormDataArray((prev) => {
            const next = [...prev];
            next[index] = {
                ...next[index],
                healthAnswers: { ...next[index].healthAnswers, [questionId]: value },
            };
            return next;
        });
    };

    const markNoHealthConditions = (index) => {
        const cleared = HEALTH_QUESTIONS.reduce(
            (answers, question) => ({ ...answers, [question.id]: 'no' }),
            {}
        );
        setFormDataArray((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], healthAnswers: cleared };
            return next;
        });
    };

    // The lead hiker carries the group's contact and residential details. Companions
    // only need an identity, a health declaration, and a signed waiver, and default to
    // the lead's emergency contact unless they declare their own.
    const isHikerComplete = (formData, isLead) => {
        const hasIdentity =
            formData.fullName.trim() !== '' &&
            formData.dateOfBirth.trim() !== '' &&
            areHealthAnswersComplete(formData.healthAnswers) &&
            formData.agreeWaiver;

        if (isLead) {
            return (
                hasIdentity &&
                formData.address.trim() !== '' &&
                isDeliverableEmail(formData.email) &&
                formData.emergencyName.trim() !== '' &&
                formData.emergencyRelationship !== '' &&
                formData.emergencyContact.trim() !== ''
            );
        }

        const hasEmergencyContact = formData.shareEmergencyContact ||
            (formData.emergencyName.trim() !== '' &&
                formData.emergencyRelationship !== '' &&
                formData.emergencyContact.trim() !== '');

        return hasIdentity && hasEmergencyContact;
    };

    const isFormValid = formDataArray.every((formData, index) =>
        isHikerComplete(formData, index === 0)
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid || !onNext) return;

        const [lead] = formDataArray;

        // Resolve companions' inherited contacts so every hiker record downstream
        // (booking, e-pass, staff roster) is self-contained.
        const resolved = formDataArray.map((formData, index) => {
            if (index === 0 || !formData.shareEmergencyContact) {
                return { ...formData, shareEmergencyContact: undefined };
            }

            return {
                ...formData,
                emergencyName: lead.emergencyName,
                emergencyRelationship: lead.emergencyRelationship,
                emergencyContact: lead.emergencyContact,
                shareEmergencyContact: undefined,
            };
        });

        onNext(resolved);
    };

    const maxDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6">
            <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-4 md:p-5">
                <p className="text-sm text-on-surface-variant leading-relaxed">
                    <span className="font-bold text-on-surface">Hiker 1 is the booking lead</span> and covers the
                    group's contact, address, email, and emergency contact. Everyone after that only needs their
                    name, date of birth, health declaration, and waiver signature.
                </p>
            </div>

            {formDataArray.map((formData, index) => {
                const isLead = index === 0;
                const isOpen = openHikerIndex === index;
                const complete = isHikerComplete(formData, isLead);
                const allHealthNo = areAllHealthAnswersNo(formData.healthAnswers);

                return (
                    <div
                        key={index}
                        className={`bg-surface-container-lowest border rounded-2xl overflow-hidden shadow-xs transition-all duration-300 ${isOpen
                            ? 'border-primary/40 ring-1 ring-primary/20'
                            : 'border-outline-variant/60 hover:border-outline-variant'
                            }`}
                    >
                        {/* Accordion Header */}
                        <div
                            onClick={() => toggleHiker(index)}
                            className="flex items-center justify-between p-5 md:p-6 cursor-pointer select-none bg-surface-container-lowest hover:bg-surface-container-low/50 transition-colors"
                        >
                            <div className="flex items-center gap-3.5 flex-wrap">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${complete
                                    ? 'bg-primary/15 text-primary'
                                    : 'bg-surface-container-high text-on-surface-variant'
                                    }`}>
                                    {index + 1}
                                </div>
                                <h2 className="text-xl md:text-2xl font-extrabold text-on-surface tracking-tight">
                                    {isLead ? 'Lead Hiker' : `Companion ${index}`}
                                </h2>
                                {isLead && (
                                    <span className="text-xs font-semibold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full inline-flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        Booker
                                    </span>
                                )}
                                {formData.fullName.trim() !== '' && (
                                    <span className="text-xs font-semibold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">
                                        {formData.fullName}
                                    </span>
                                )}
                                {complete ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Complete
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-outline bg-surface-container px-2.5 py-0.5 rounded-full">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        Incomplete
                                    </span>
                                )}
                            </div>
                            <ChevronDown
                                className={`h-5 w-5 text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''
                                    }`}
                            />
                        </div>

                        {/* Accordion Content */}
                        {isOpen && (
                            <div className="space-y-8 p-6 md:p-8 pt-2 border-t border-outline-variant/30 animate-in fade-in duration-200">
                                {/* Hiker Profile Section */}
                                <section className="space-y-4">
                                    <h3 className="text-lg font-extrabold text-on-surface flex items-center gap-2.5 border-b border-outline-variant/20 pb-3">
                                        <User className="h-5 w-5 text-primary" />
                                        Hiker Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
                                                Full Name
                                            </label>
                                            <Input
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={(e) => handleInputChange(index, e)}
                                                className="w-full"
                                                placeholder="Juan Dela Cruz"
                                                type="text"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
                                                Date of Birth
                                            </label>
                                            <Input
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={(e) => handleInputChange(index, e)}
                                                max={maxDate}
                                                className="w-full"
                                                type="date"
                                                required
                                            />
                                        </div>
                                        {isLead && (
                                            <div className="space-y-1.5 md:col-span-2">
                                                <label htmlFor="hiker-email" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
                                                    Email for Confirmation
                                                </label>
                                                <Input
                                                    id="hiker-email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange(index, e)}
                                                    className="w-full"
                                                    placeholder="you@example.com"
                                                    type="email"
                                                    autoComplete="email"
                                                    required
                                                />
                                                <p className="text-xs leading-relaxed text-on-surface-variant">
                                                    Your confirmation, e-passes, and booking reference go here. Everyone
                                                    in your group is covered by this one inbox.
                                                </p>
                                            </div>
                                        )}
                                        {isLead && (
                                            <div className="space-y-1.5 md:col-span-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
                                                    Complete Address
                                                </label>
                                                <Input
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={(e) => handleInputChange(index, e)}
                                                    className="w-full"
                                                    placeholder="Barangay, City/Municipality, Province"
                                                    type="text"
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Emergency Contact Section */}
                                <section className="space-y-4">
                                    <h3 className="text-lg font-extrabold text-on-surface flex items-center gap-2.5 border-b border-outline-variant/20 pb-3">
                                        <PhoneCall className="h-5 w-5 text-primary" />
                                        Emergency Contact
                                    </h3>

                                    {!isLead && (
                                        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-primary-container/10 border border-primary/30">
                                            <input
                                                type="checkbox"
                                                name="shareEmergencyContact"
                                                checked={formData.shareEmergencyContact}
                                                onChange={(e) => handleInputChange(index, e)}
                                                className="mt-0.5 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                                            />
                                            <span className="text-sm font-medium text-on-surface leading-relaxed">
                                                Same emergency contact as the lead hiker
                                                {formData.shareEmergencyContact && formDataArray[0].fullName.trim() !== '' && (
                                                    <span className="block text-xs text-on-surface-variant mt-0.5">
                                                        Contacting {formDataArray[0].fullName.trim()} on this hiker's behalf.
                                                    </span>
                                                )}
                                            </span>
                                        </label>
                                    )}

                                    {(isLead || !formData.shareEmergencyContact) && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
                                                    Contact Person Name
                                                </label>
                                                <Input
                                                    name="emergencyName"
                                                    value={formData.emergencyName}
                                                    onChange={(e) => handleInputChange(index, e)}
                                                    className="w-full"
                                                    placeholder="Maria Dela Cruz"
                                                    type="text"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
                                                    Relationship
                                                </label>
                                                <Select
                                                    name="emergencyRelationship"
                                                    value={formData.emergencyRelationship}
                                                    onChange={(e) => handleInputChange(index, e)}
                                                    className="w-full"
                                                    required
                                                >
                                                    <option value="">Select relationship</option>
                                                    {EMERGENCY_RELATIONSHIPS.map((relationship) => (
                                                        <option key={relationship} value={relationship}>
                                                            {relationship}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div className="space-y-1.5 md:col-span-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
                                                    Mobile / Phone Number
                                                </label>
                                                <Input
                                                    name="emergencyContact"
                                                    value={formData.emergencyContact}
                                                    onChange={(e) => handleInputChange(index, e)}
                                                    className="w-full"
                                                    placeholder="+63 900 000 0000"
                                                    type="tel"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </section>

                                {/* Health Declaration Section */}
                                <section className="space-y-4">
                                    <h3 className="text-lg font-extrabold text-on-surface flex items-center gap-2.5 border-b border-outline-variant/20 pb-3">
                                        <Stethoscope className="h-5 w-5 text-primary" />
                                        Health Declaration
                                    </h3>
                                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                        <p className="text-xs text-on-surface-variant">
                                            Answer for {isLead ? 'yourself' : 'this hiker'}. The guide reads this before the climb.
                                        </p>
                                        {!allHealthNo && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => markNoHealthConditions(index)}
                                                className="rounded-lg border-outline-variant hover:bg-surface-container cursor-pointer"
                                            >
                                                None of these apply
                                            </Button>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        {HEALTH_QUESTIONS.map((item) => {
                                            const currentAnswer = formData.healthAnswers[item.id];
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/40"
                                                >
                                                    <p className="text-sm font-medium text-on-surface sm:w-3/4 leading-snug">
                                                        {item.question}
                                                    </p>
                                                    <div className="flex gap-2 shrink-0">
                                                        {['yes', 'no'].map((option) => {
                                                            const isSelected = currentAnswer === option;
                                                            return (
                                                                <label key={option} className="cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        name={`hiker_${index}_${item.id}`}
                                                                        value={option}
                                                                        checked={isSelected}
                                                                        onChange={() => handleHealthChange(index, item.id, option)}
                                                                        className="sr-only"
                                                                    />
                                                                    <span
                                                                        className={`inline-block px-5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${isSelected
                                                                            ? 'bg-primary text-inverse-on-surface shadow-xs'
                                                                            : 'bg-surface border border-outline-variant/80 text-on-surface-variant hover:border-primary/50'
                                                                            }`}
                                                                    >
                                                                        {option}
                                                                    </span>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>

                                {/* Liability Waiver Section */}
                                <section className="space-y-4">
                                    <h3 className="text-lg font-extrabold text-on-surface flex items-center gap-2.5 border-b border-outline-variant/20 pb-3">
                                        <Scale className="h-5 w-5 text-primary" />
                                        Liability Waiver
                                    </h3>
                                    <div className="h-40 overflow-y-auto p-4 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-xs text-on-surface-variant leading-relaxed space-y-2.5">
                                        <p>
                                            <strong className="text-on-surface">1. Assumption of Risk:</strong> I understand that hiking Mount
                                            Masaraga involves inherent risks, including physical exertion, unpredictable weather, and encounters with wildlife.
                                        </p>
                                        <p>
                                            <strong className="text-on-surface">2. Waiver of Liability:</strong> I hereby release Mount
                                            Masaraga Protected Landscape management and its accredited guides from liability for personal injury, loss, or damage incurred during the activity.
                                        </p>
                                        <p>
                                            <strong className="text-on-surface">3. Regulatory Compliance:</strong> I agree to follow designated trails and obey park rangers and guide instructions at all times.
                                        </p>
                                        <p>
                                            <strong className="text-on-surface">4. Environmental Commitment:</strong> I commit to Leave No Trace principles and understand that violations carry administrative fines.
                                        </p>
                                    </div>
                                    <label className="flex items-start gap-3 cursor-pointer p-1">
                                        <input
                                            type="checkbox"
                                            name="agreeWaiver"
                                            checked={formData.agreeWaiver}
                                            onChange={(e) => handleInputChange(index, e)}
                                            required
                                            className="mt-0.5 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                                        />
                                        <span className="text-xs font-medium text-on-surface leading-normal">
                                            {isLead ? 'I have read' : `${formData.fullName.trim() || 'This hiker'} has read`}, understood, and agree to the terms outlined in the Mount Masaraga Protected Landscape Liability Waiver.
                                        </span>
                                    </label>
                                </section>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                <Button
                    type="button"
                    onClick={onBack}
                    variant="outline"
                    size="lg"
                    className="rounded-xl border-outline-variant hover:bg-surface-container cursor-pointer"
                >
                    Back to Dates
                </Button>
                <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    disabled={!isFormValid}
                    className="rounded-xl bg-primary font-bold shadow-md hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                >
                    Proceed to Payment
                </Button>
            </div>
        </form>
    );
}
