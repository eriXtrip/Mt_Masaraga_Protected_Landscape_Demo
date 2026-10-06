import { Check, FileWarning, ShieldCheck } from 'lucide-react';
import { CHECKLIST_ITEMS } from '../../mockData';
import StaffStatusBadge from './StaffStatusBadge';

export default function StaffDocumentChecklist({ statuses = {}, onChange, readOnly = false, compact = false }) {
    return (
        <fieldset className="space-y-3">
            <legend className="sr-only">Physical document checklist</legend>
            {CHECKLIST_ITEMS.map((item) => {
                const documentStatus = statuses[item.id] || { status: 'Pending' };
                const isComplete = documentStatus.status === 'Complete';
                const statusLabel = isComplete ? 'Complete' : documentStatus.status === 'Missing' ? 'Missing' : 'Needs follow-up';

                return (
                    <div key={item.id} className={`rounded-xl border bg-surface-container-lowest ${isComplete ? 'border-primary/30' : 'border-amber-200/80'}`}>
                        <label className="flex min-h-11 cursor-pointer items-start gap-3 px-3 py-3">
                            <input
                                type="checkbox"
                                checked={isComplete}
                                disabled={readOnly}
                                onChange={(event) => onChange?.(item.id, event.target.checked ? 'Complete' : 'Needs follow-up')}
                                className="mt-0.5 h-5 w-5 shrink-0 rounded border-outline-variant text-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
                            />
                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold leading-snug text-on-surface">{item.title}</span>
                                <span className="mt-0.5 block text-xs leading-relaxed text-on-surface-variant">{item.description}</span>
                            </span>
                            <StaffStatusBadge status={documentStatus.status === 'Missing' ? 'Needs follow-up' : documentStatus.status} label={statusLabel} />
                        </label>
                        {!readOnly && (
                            <div className="flex flex-wrap gap-2 border-t border-outline-variant/20 px-3 py-2">
                                <button
                                    type="button"
                                    onClick={() => onChange?.(item.id, 'Complete')}
                                    className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                >
                                    <Check className="h-4 w-4" />
                                    Mark complete
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onChange?.(item.id, 'Needs follow-up')}
                                    className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                                >
                                    <FileWarning className="h-4 w-4" />
                                    Needs follow-up
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
            {compact && (
                <p className="flex items-start gap-2 text-xs leading-relaxed text-on-surface-variant">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    Physical originals are checked at jump-off. A digital pass alone does not replace required documents.
                </p>
            )}
        </fieldset>
    );
}
