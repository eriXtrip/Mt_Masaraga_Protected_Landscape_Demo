import { useEffect, useRef, useState } from 'react';
import { Plus, Save, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDrawerTransition } from '@/hooks/useDrawerTransition';
import { toast } from '@/components/ui/toast';
import { LEGAL_PAGES } from '@/mockData';

const GENERAL_CONFIG = {
    eyebrow: 'General settings',
    title: 'Edit site identity',
    description: 'Update the public site name and office information shown to visitors.',
    fields: [
        { name: 'siteName', label: 'Site name', type: 'text', required: true },
        { name: 'officeName', label: 'Office name', type: 'text', required: true },
        { name: 'officeAddress', label: 'Office address', type: 'text', required: true },
        { name: 'officeHours', label: 'Office hours', type: 'text', required: true },
    ],
};

const CONTACT_CONFIG = {
    eyebrow: 'Public contact',
    title: 'Edit contact channels',
    description: 'Keep visitor-facing phone, email, emergency, and map details in one place.',
    fields: [
        { name: 'supportEmail', label: 'Support email', type: 'email', required: true },
        { name: 'officePhone', label: 'Office phone', type: 'text', required: true },
        { name: 'emergencyPhone', label: 'Emergency phone', type: 'text', required: true },
        { name: 'emergencyAvailability', label: 'Emergency availability', type: 'text', required: true },
        { name: 'mapUrl', label: 'Map destination URL', type: 'url', required: true },
        { name: 'latitude', label: 'Map latitude', type: 'number', step: 'any', min: -90, max: 90, required: true },
        { name: 'longitude', label: 'Map longitude', type: 'number', step: 'any', min: -180, max: 180, required: true },
        { name: 'facebook', label: 'Facebook URL', type: 'url' },
        { name: 'instagram', label: 'Instagram URL', type: 'url' },
        { name: 'x', label: 'X URL', type: 'url' },
    ],
};

const BOOKING_CONFIG = {
    eyebrow: 'Booking defaults',
    title: 'Edit booking defaults',
    description: 'Set the default amounts and capacity guidance used for new schedules.',
    fields: [
        { name: 'baseFeePerPax', label: 'Base fee per hiker', type: 'number', min: 0, required: true },
        { name: 'environmentalFee', label: 'Environmental fee', type: 'number', min: 0, required: true },
        { name: 'processingFee', label: 'Processing fee', type: 'number', min: 0, required: true },
        { name: 'guideFeePerGroup', label: 'Guide fee per group', type: 'number', min: 0, required: true },
        { name: 'defaultDailyCapacity', label: 'Default daily capacity', type: 'number', min: 1, required: true },
        { name: 'guideRatio', label: 'Hikers per guide', type: 'number', min: 1, required: true },
        { name: 'maxGroupSize', label: 'Maximum group size', type: 'number', min: 1, required: true },
    ],
};

const MAINTENANCE_CONFIG = {
    eyebrow: 'Utility page',
    title: 'Edit maintenance notice',
    description: 'Control the public maintenance page without changing its route or animation.',
    fields: [
        { name: 'enabled', label: 'Maintenance mode', type: 'checkbox' },
        { name: 'title', label: 'Page title', type: 'text', required: true },
        { name: 'message', label: 'Notice message', type: 'textarea', required: true },
        { name: 'estimatedCompletion', label: 'Estimated completion', type: 'text', required: true },
    ],
};

const LEGAL_CONFIG = {
    eyebrow: 'Legal page',
    title: 'Edit legal page',
    description: 'Update the publication details and the visitor-facing policy text.',
    fields: [
        { name: 'enabled', label: 'Page published', type: 'checkbox' },
        { name: 'showInFooter', label: 'Show in footer', type: 'checkbox' },
        { name: 'title', label: 'Page title', type: 'text', required: true },
        { name: 'subtitle', label: 'Page subtitle', type: 'text' },
        { name: 'lastUpdated', label: 'Last updated', type: 'date', required: true },
    ],
};

const UTILITY_CONFIGS = {
    notFound: {
        eyebrow: 'Utility page',
        title: 'Edit page not found message',
        description: 'Keep the unavailable-route message useful for visitors who follow an old link.',
        fields: [
            { name: 'enabled', label: 'Utility page enabled', type: 'checkbox' },
            { name: 'title', label: 'Page title', type: 'text', required: true },
            { name: 'message', label: 'Page message', type: 'textarea', required: true },
        ],
    },
    accessDenied: {
        eyebrow: 'Utility page',
        title: 'Edit access denied message',
        description: 'Explain the clearance requirement and keep the next action clear.',
        fields: [
            { name: 'enabled', label: 'Utility page enabled', type: 'checkbox' },
            { name: 'title', label: 'Page title', type: 'text', required: true },
            { name: 'message', label: 'Page message', type: 'textarea', required: true },
        ],
    },
    bookingSuspended: {
        eyebrow: 'Utility page',
        title: 'Edit booking suspension',
        description: 'Pause new reservations without changing the booking page route or existing hiker tools.',
        fields: [
            { name: 'enabled', label: 'Suspend new bookings', type: 'checkbox' },
            { name: 'title', label: 'Page title', type: 'text', required: true },
            { name: 'message', label: 'Suspension message', type: 'textarea', required: true },
            { name: 'reopenNote', label: 'Reopening guidance', type: 'text', required: true },
        ],
    },
};

function getFormConfig(section, itemKey) {
    if (section === 'legal') return LEGAL_CONFIG;
    if (section === 'utility') return UTILITY_CONFIGS[itemKey] || UTILITY_CONFIGS.notFound;
    if (section === 'general') return GENERAL_CONFIG;
    if (section === 'contact') return CONTACT_CONFIG;
    if (section === 'booking') return BOOKING_CONFIG;
    return MAINTENANCE_CONFIG;
}

function createInitialForm(value, fields) {
    return fields.reduce((form, field) => {
        const nextValue = value?.[field.name];
        if (field.type === 'checkbox') {
            form[field.name] = Boolean(nextValue);
        } else if (field.type === 'number') {
            form[field.name] = nextValue === '' || nextValue === null || nextValue === undefined ? '' : Number(nextValue);
        } else {
            form[field.name] = nextValue ?? '';
        }
        return form;
    }, {});
}

function Field({ field, value, onChange }) {
    const id = `setting-${field.name}`;

    if (field.type === 'checkbox') {
        return (
            <label htmlFor={id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-outline-variant/40 bg-surface px-3.5 py-2.5 transition-colors hover:border-primary/60">
                <input
                    id={id}
                    type="checkbox"
                    checked={value}
                    onChange={onChange}
                    className="h-5 w-5 shrink-0 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                <span className="text-sm font-medium text-on-surface">{field.label}</span>
            </label>
        );
    }

    if (field.type === 'textarea') {
        return (
            <div>
                <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
                    {field.label}
                </label>
                <textarea
                    id={id}
                    rows={5}
                    value={value}
                    onChange={onChange}
                    required={field.required}
                    className="w-full resize-y rounded-lg border border-outline-variant bg-surface px-3.5 py-2.5 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
            </div>
        );
    }

    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
                {field.label}
            </label>
            <Input
                id={id}
                type={field.type}
                value={value}
                onChange={onChange}
                required={field.required}
                min={field.min}
                max={field.max}
                step={field.step}
                className="h-11"
            />
        </div>
    );
}

let legalSectionId = 0;

function createLegalSectionId() {
    legalSectionId += 1;
    return `legal-section-${legalSectionId}`;
}

function serializeLegalContent(content) {
    return (Array.isArray(content) ? content : [])
        .map((item) => {
            if (item?.type === 'paragraph') {
                return typeof item.text === 'string' ? item.text : '';
            }

            if (item?.type === 'list') {
                return (Array.isArray(item.items) ? item.items : [])
                    .filter((item) => typeof item === 'string')
                    .map((item) => `- ${item}`)
                    .join('\n');
            }

            return '';
        })
        .filter(Boolean)
        .join('\n\n');
}

function parseLegalContent(value) {
    const content = [];
    let paragraphLines = [];
    let listItems = [];

    const flushParagraph = () => {
        if (paragraphLines.length === 0) return;
        content.push({ type: 'paragraph', text: paragraphLines.join(' ') });
        paragraphLines = [];
    };

    const flushList = () => {
        if (listItems.length === 0) return;
        content.push({ type: 'list', items: listItems });
        listItems = [];
    };

    String(value ?? '')
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .forEach((line) => {
            const trimmedLine = line.trim();

            if (!trimmedLine) {
                flushParagraph();
                flushList();
                return;
            }

            if (line.startsWith('- ')) {
                flushParagraph();
                listItems.push(trimmedLine.slice(2).trim());
                return;
            }

            flushList();
            paragraphLines.push(trimmedLine);
        });

    flushParagraph();
    flushList();

    return content;
}

function createLegalDraft(value) {
    return {
        intro: serializeLegalContent(value?.introductoryContent),
        sections: (Array.isArray(value?.sections) ? value.sections : []).map((section) => ({
            id: createLegalSectionId(),
            title: section?.title ?? '',
            content: serializeLegalContent(section?.content),
        })),
    };
}

function hasEmptyListItem(content) {
    return content.some((item) => item.type === 'list' && item.items.some((listItem) => !listItem));
}

function validateLegalDraft(draft) {
    if (draft.sections.length === 0) {
        return { message: 'Add at least one policy section.', target: 'add-section' };
    }

    const introContent = parseLegalContent(draft.intro);
    if (hasEmptyListItem(introContent)) {
        return {
            message: 'Introductory content contains an empty list item. Add text after "- ".',
            target: 'intro',
        };
    }

    for (let sectionIndex = 0; sectionIndex < draft.sections.length; sectionIndex += 1) {
        const section = draft.sections[sectionIndex];
        if (!section.title.trim()) {
            return {
                message: `Section ${sectionIndex + 1} needs a title.`,
                target: 'section-title',
                sectionId: section.id,
            };
        }

        const sectionContent = parseLegalContent(section.content);
        if (sectionContent.length === 0) {
            return {
                message: `Section ${sectionIndex + 1} needs content.`,
                target: 'section-content',
                sectionId: section.id,
            };
        }

        if (hasEmptyListItem(sectionContent)) {
            return {
                message: `Section ${sectionIndex + 1} contains an empty list item. Add text after "- ".`,
                target: 'section-content',
                sectionId: section.id,
            };
        }
    }

    return null;
}

function serializeLegalDraft(draft) {
    return {
        introductoryContent: parseLegalContent(draft.intro),
        sections: draft.sections.map((section) => ({
            title: section.title.trim(),
            content: parseLegalContent(section.content),
        })),
    };
}

function LegalContentEditor({ draft, error, onChange, onErrorChange }) {
    const introRef = useRef(null);
    const sectionTitleRefs = useRef({});
    const sectionContentRefs = useRef({});
    const addSectionButtonRef = useRef(null);
    const [focusTarget, setFocusTarget] = useState(null);

    useEffect(() => {
        const target = focusTarget || error;
        if (!target) return;

        if (target.target === 'intro') {
            introRef.current?.focus();
        } else if (target.target === 'section-title') {
            sectionTitleRefs.current[target.sectionId]?.focus();
        } else if (target.target === 'section-content') {
            sectionContentRefs.current[target.sectionId]?.focus();
        } else if (target.target === 'add-section') {
            addSectionButtonRef.current?.focus();
        }

        if (focusTarget) setFocusTarget(null);
    }, [error, focusTarget]);

    const updateIntro = (event) => {
        onErrorChange(null);
        onChange((current) => ({ ...current, intro: event.target.value }));
    };

    const updateSection = (sectionId, field, value) => {
        onErrorChange(null);
        onChange((current) => ({
            ...current,
            sections: current.sections.map((section) => (
                section.id === sectionId ? { ...section, [field]: value } : section
            )),
        }));
    };

    const addSection = () => {
        const id = createLegalSectionId();
        onErrorChange(null);
        onChange((current) => ({
            ...current,
            sections: [...current.sections, { id, title: '', content: '' }],
        }));
        setFocusTarget({ target: 'section-title', sectionId: id });
    };

    const removeSection = (sectionId) => {
        const removedIndex = draft.sections.findIndex((section) => section.id === sectionId);
        const nextSections = draft.sections.filter((section) => section.id !== sectionId);
        const nextSection = nextSections[Math.min(removedIndex, nextSections.length - 1)];

        onErrorChange(null);
        onChange((current) => ({
            ...current,
            sections: current.sections.filter((section) => section.id !== sectionId),
        }));
        setFocusTarget(nextSection
            ? { target: 'section-title', sectionId: nextSection.id }
            : { target: 'add-section' });
    };

    const introError = error?.target === 'intro' ? error.message : '';

    return (
        <section className="space-y-5 border-t border-outline-variant/20 pt-5" aria-labelledby="legal-content-heading">
            <div>
                <h3 id="legal-content-heading" className="text-sm font-bold text-on-surface">Policy content</h3>
                <p id="legal-content-help" className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                    Leave a blank line between paragraphs. Start each list item with <code className="rounded bg-surface-container px-1 py-0.5 font-mono text-on-surface">- </code> on its own line.
                </p>
            </div>

            {error && (
                <p id="legal-content-error" role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
                    {error.message}
                </p>
            )}

            <div>
                <label htmlFor="legal-introduction" className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
                    Introduction (optional)
                </label>
                <textarea
                    ref={introRef}
                    id="legal-introduction"
                    rows={7}
                    value={draft.intro}
                    onChange={updateIntro}
                    placeholder="Optional introduction"
                    aria-invalid={Boolean(introError)}
                    aria-describedby={`legal-content-help${introError ? ' legal-content-error' : ''}`}
                    className="w-full resize-y rounded-lg border border-outline-variant bg-surface px-3.5 py-2.5 text-sm font-medium leading-relaxed text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none aria-invalid:border-destructive aria-invalid:ring-destructive/30"
                />
            </div>

            <div className="space-y-4">
                {draft.sections.map((section, sectionIndex) => {
                    const titleError = error?.target === 'section-title' && error.sectionId === section.id
                        ? error.message
                        : '';
                    const contentError = error?.target === 'section-content' && error.sectionId === section.id
                        ? error.message
                        : '';
                    const titleId = `legal-${section.id}-title`;
                    const contentId = `legal-${section.id}-content`;
                    const groupLabelId = `legal-${section.id}-label`;

                    return (
                        <div
                            key={section.id}
                            role="group"
                            aria-labelledby={groupLabelId}
                            className="space-y-4 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p id={groupLabelId} className="text-xs font-bold text-on-surface">
                                    Section {sectionIndex + 1}
                                </p>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="h-11 gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => removeSection(section.id)}
                                    disabled={draft.sections.length === 1}
                                    aria-label={`Remove section ${sectionIndex + 1}`}
                                >
                                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                                    Remove
                                </Button>
                            </div>

                            <div>
                                <label htmlFor={titleId} className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
                                    Section title
                                </label>
                                <Input
                                    ref={(node) => {
                                        sectionTitleRefs.current[section.id] = node;
                                    }}
                                    id={titleId}
                                    value={section.title}
                                    onChange={(event) => updateSection(section.id, 'title', event.target.value)}
                                    aria-invalid={Boolean(titleError)}
                                    aria-describedby={titleError ? 'legal-content-error' : undefined}
                                    className="h-11 aria-invalid:border-destructive aria-invalid:ring-destructive/30"
                                />
                            </div>

                            <div>
                                <label htmlFor={contentId} className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
                                    Section content
                                </label>
                                <textarea
                                    ref={(node) => {
                                        sectionContentRefs.current[section.id] = node;
                                    }}
                                    id={contentId}
                                    rows={10}
                                    value={section.content}
                                    onChange={(event) => updateSection(section.id, 'content', event.target.value)}
                                    placeholder={'Paragraph text\n\n- List item'}
                                    aria-invalid={Boolean(contentError)}
                                    aria-describedby={`legal-content-help${contentError ? ' legal-content-error' : ''}`}
                                    className="w-full resize-y rounded-lg border border-outline-variant bg-surface px-3.5 py-2.5 text-sm font-medium leading-relaxed text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none aria-invalid:border-destructive aria-invalid:ring-destructive/30"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <Button
                ref={addSectionButtonRef}
                type="button"
                variant="outline"
                className="h-11 w-full gap-2 sm:w-auto"
                onClick={addSection}
            >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add section
            </Button>
        </section>
    );
}

export default function SettingsForm({ section, itemKey, value, onSave, onClose }) {
    const config = getFormConfig(section, itemKey);
    const closeButtonRef = useRef(null);
    const dialogRef = useRef(null);
    const { closing, requestClose, handleAnimationEnd } = useDrawerTransition(onClose);
    const legalSource = section === 'legal'
        ? { ...(LEGAL_PAGES[itemKey] ?? {}), ...(value ?? {}) }
        : null;
    const formSource = section === 'legal' ? legalSource : value;
    const [form, setForm] = useState(() => createInitialForm(formSource, config.fields));
    const [legalDraft, setLegalDraft] = useState(() => (
        section === 'legal' ? createLegalDraft(legalSource) : null
    ));
    const [legalError, setLegalError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                requestClose();
                return;
            }

            if (event.key !== 'Tab') return;

            const focusableElements = dialogRef.current?.querySelectorAll(
                'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]'
            );
            if (!focusableElements?.length) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        closeButtonRef.current?.focus();
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [requestClose]);

    const setField = (field) => (event) => {
        const nextValue = field.type === 'checkbox'
            ? event.target.checked
            : field.type === 'number'
                ? event.target.value === '' ? '' : Number(event.target.value)
                : event.target.value;
        setForm((current) => ({ ...current, [field.name]: nextValue }));
        setLegalError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLegalError(null);

        const missingField = config.fields.find((field) => field.required && (form[field.name] === '' || form[field.name] === null || form[field.name] === undefined));
        if (missingField) {
            toast.error(`${missingField.label} is required.`);
            return;
        }

        const invalidNumber = config.fields.find((field) => field.type === 'number' && form[field.name] !== '' && (
            !Number.isFinite(Number(form[field.name]))
            || Number(form[field.name]) < (field.min ?? 0)
            || (field.max !== undefined && Number(form[field.name]) > field.max)
        ));
        if (invalidNumber) {
            toast.error(`${invalidNumber.label} must be a valid number.`);
            return;
        }

        const invalidEmail = config.fields.find((field) => field.type === 'email' && form[field.name] && !/^\S+@\S+\.\S+$/.test(form[field.name]));
        if (invalidEmail) {
            toast.error(`${invalidEmail.label} must be a valid email address.`);
            return;
        }

        const invalidUrl = config.fields.find((field) => field.type === 'url' && form[field.name] && !/^https?:\/\//i.test(form[field.name]));
        if (invalidUrl) {
            toast.error(`${invalidUrl.label} must start with http:// or https://.`);
            return;
        }

        let updates = form;
        if (section === 'legal' && legalDraft) {
            const legalValidationError = validateLegalDraft(legalDraft);
            if (legalValidationError) {
                setLegalError(legalValidationError);
                toast.error(legalValidationError.message);
                return;
            }

            updates = {
                ...form,
                ...serializeLegalDraft(legalDraft),
            };
        }

        setIsSubmitting(true);
        try {
            await onSave(updates);
            requestClose();
        } catch (error) {
            toast.error('Settings could not be saved.');
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
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="settings-form-title"
                onAnimationEnd={closing ? handleAnimationEnd : undefined}
                className={`absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col bg-surface-container-lowest shadow-xl ${closing ? 'animate-out slide-out-to-right animation-duration-300' : 'animate-in slide-in-from-right animation-duration-300'} motion-reduce:animate-none`}
            >
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{config.eyebrow}</p>
                        <h2 id="settings-form-title" className="mt-1 text-lg font-bold text-on-surface">{config.title}</h2>
                        <p className="mt-1 max-w-lg text-xs leading-relaxed text-on-surface-variant">{config.description}</p>
                    </div>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={requestClose}
                        aria-label="Close settings editor"
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <form id="settings-editor-form" onSubmit={handleSubmit} className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
                    {config.fields.map((field) => (
                        <Field key={field.name} field={field} value={form[field.name]} onChange={setField(field)} />
                    ))}
                    {section === 'legal' && legalDraft && (
                        <LegalContentEditor
                            draft={legalDraft}
                            error={legalError}
                            onChange={setLegalDraft}
                            onErrorChange={setLegalError}
                        />
                    )}
                </form>

                <div className="flex items-center justify-end gap-3 border-t border-outline-variant/20 px-5 py-4">
                    <Button type="button" variant="ghost" className="h-11" onClick={requestClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" form="settings-editor-form" className="h-11 gap-2" disabled={isSubmitting}>
                        <Save className="h-4 w-4" aria-hidden="true" />
                        {isSubmitting ? 'Saving...' : 'Save settings'}
                    </Button>
                </div>
            </aside>
        </div>
    );
}
