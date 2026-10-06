import React from 'react';
import { HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionCard, Field } from './SectionCard';

export default function EmergencyContactForm({ form, onFieldChange, onSave }) {
    return (
        <SectionCard
            icon={HeartPulse}
            title="Emergency Contact"
            subtitle="Who the trailhead station should reach in case of an incident."
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Full Name">
                    <Input
                        value={form.emergencyName}
                        onChange={onFieldChange('emergencyName')}
                        placeholder="Emergency contact name"
                    />
                </Field>
                <Field label="Relation">
                    <Input
                        value={form.emergencyRelation}
                        onChange={onFieldChange('emergencyRelation')}
                        placeholder="e.g. Parent, Sibling"
                    />
                </Field>
                <Field label="Mobile Number">
                    <Input
                        type="tel"
                        value={form.emergencyMobile}
                        onChange={onFieldChange('emergencyMobile')}
                        placeholder="+63 917 000 0000"
                    />
                </Field>
            </div>

            <div className="flex justify-end pt-2">
                <Button type="submit" variant="default" className="gap-2 cursor-pointer" onClick={onSave}>
                    Save Changes
                </Button>
            </div>
        </SectionCard>
    );
}
