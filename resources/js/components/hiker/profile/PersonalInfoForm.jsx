import React from 'react';
import { UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionCard, Field } from './SectionCard';

export default function PersonalInfoForm({ form, onFieldChange, onSave }) {
    return (
        <SectionCard
            icon={UserRound}
            title="Personal Information"
            subtitle="Used to issue your digital passes and receipts."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full Name">
                    <Input
                        value={form.name}
                        onChange={onFieldChange('name')}
                        placeholder="Your full name"
                        required
                    />
                </Field>
                <Field label="Email Address">
                    <Input
                        type="email"
                        value={form.email}
                        onChange={onFieldChange('email')}
                        placeholder="you@example.com"
                        required
                    />
                </Field>
            </div>

            <Field label="Mobile Number" hint="Enter with your country code, e.g. +63.">
                <Input
                    type="tel"
                    value={form.mobile}
                    onChange={onFieldChange('mobile')}
                    placeholder="+63 917 000 0000"
                />
            </Field>

            <div className="flex justify-end pt-2">
                <Button type="submit" variant="default" className="gap-2 cursor-pointer">
                    Save Changes
                </Button>
            </div>
        </SectionCard>
    );
}
