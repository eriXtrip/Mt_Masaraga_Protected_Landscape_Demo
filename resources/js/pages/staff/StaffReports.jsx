import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ClipboardList, Download, FileWarning, MapPin, Plus, ShieldAlert } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { Button } from '@/components/ui/button';
import { toast } from '../../components/ui/toast';
import { addIncident, addTrailLog, useStaffStore } from '../../state/staffStore';
import StaffEmptyState from '../../components/staff/StaffEmptyState';
import StaffMetricCard from '../../components/staff/StaffMetricCard';
import StaffPageHeader from '../../components/staff/StaffPageHeader';
import StaffStatusBadge from '../../components/staff/StaffStatusBadge';

const formatTime = (value) => value ? new Intl.DateTimeFormat('en-PH', { hour: 'numeric', minute: '2-digit' }).format(new Date(value)) : '';

export default function StaffReports() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const { assignedSchedules, checkIns, incidents, operationalDate, passes, trailLogs } = useStaffStore();
    const [activeTab, setActiveTab] = useState('logs');
    // A staff member is assigned per date, so the same trail shows up on many schedules.
    const trailOptions = useMemo(() => [...new Set(assignedSchedules.map((schedule) => schedule.trail))], [assignedSchedules]);
    const [logTrail, setLogTrail] = useState(trailOptions[0] || '');
    const [logSummary, setLogSummary] = useState('');
    const [incidentTrail, setIncidentTrail] = useState(trailOptions[0] || '');
    const [incidentSeverity, setIncidentSeverity] = useState('Low');
    const [incidentSummary, setIncidentSummary] = useState('');

    const todaySchedules = assignedSchedules.filter((schedule) => schedule.dateKey === operationalDate);
    const todayScheduleIds = new Set(todaySchedules.map((schedule) => schedule.id));
    const todayPasses = useMemo(() => passes.filter((pass) => todayScheduleIds.has(pass.scheduleId)), [passes, todayScheduleIds]);
    const checkedInCount = todayPasses.filter((pass) => checkIns[pass.id]).length;

    const handleAddLog = (event) => {
        event.preventDefault();
        if (!logTrail || !logSummary.trim()) return;
        addTrailLog({ trail: logTrail, summary: logSummary.trim() });
        setLogSummary('');
        toast.add({ type: 'success', title: 'Trail log saved', description: 'The field observation is now part of the duty report.' });
    };

    const handleAddIncident = (event) => {
        event.preventDefault();
        if (!incidentTrail || !incidentSummary.trim()) return;
        addIncident({ trail: incidentTrail, severity: incidentSeverity, summary: incidentSummary.trim() });
        setIncidentSummary('');
        toast.add({ type: 'success', title: 'Incident recorded', description: 'The incident was added to the open field report queue.' });
    };

    const downloadReport = () => {
        const rows = [
            ['Record type', 'Date', 'Trail', 'Status', 'Details'],
            ...trailLogs.map((log) => ['Trail log', log.date, log.trail, 'Recorded', log.summary]),
            ...incidents.map((incident) => ['Incident', incident.date, incident.trail, incident.status, `${incident.severity}: ${incident.summary}`]),
            ...todayPasses.map((pass) => ['Summit check-in', operationalDate, pass.trail, checkIns[pass.id] ? 'Checked in' : 'Pending', `${pass.hikerName} · ${pass.id}`]),
        ];
        const csv = rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = `masaraga-staff-report-${operationalDate}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast.add({ type: 'success', title: 'Report downloaded', description: 'The current field report was exported as CSV.' });
    };

    const tabs = [
        { id: 'logs', label: 'Daily trail log', count: trailLogs.length },
        { id: 'incidents', label: 'Incidents', count: incidents.length },
        { id: 'checkins', label: 'Summit check-ins', count: todayPasses.length },
    ];

    return (
        <div ref={sectionRef} className="space-y-6 md:space-y-8">
            <div style={{ transitionDelay: '0ms' }} className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                <StaffPageHeader
                    eyebrow="Park staff · Records"
                    title="Field reports"
                    description="Keep a concise record of trail observations, incidents, and hiker check-ins for the current duty day."
                >
                    <Button type="button" variant="outline" size="lg" onClick={downloadReport} className="min-h-11 cursor-pointer gap-2"><Download className="h-4 w-4" />Export CSV</Button>
                </StaffPageHeader>
            </div>

            <section style={{ transitionDelay: '150ms' }} aria-label="Report summary" className={`grid grid-cols-1 gap-3 transition-all duration-700 ease-out sm:grid-cols-3 ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                <StaffMetricCard icon={ClipboardList} value={trailLogs.length} label="Trail logs" detail="Entries saved for this duty" tone="primary" />
                <StaffMetricCard icon={ShieldAlert} value={incidents.filter((incident) => incident.status === 'Open').length} label="Open incidents" detail="Require follow-up before closeout" tone={incidents.some((incident) => incident.status === 'Open') ? 'amber' : 'teal'} />
                <StaffMetricCard icon={Check} value={`${checkedInCount}/${todayPasses.length}`} label="Check-ins" detail="Pass state across assigned records" tone="teal" />
            </section>

            <div style={{ transitionDelay: '250ms' }} className={`grid gap-6 transition-all duration-700 ease-out xl:grid-cols-2 ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                <section aria-labelledby="log-form-heading" className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs md:p-6">
                    <div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><ClipboardList className="h-5 w-5" /></span><div><p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Daily log</p><h2 id="log-form-heading" className="mt-1 text-lg font-bold text-on-surface">Record a trail observation</h2></div></div>
                    <form onSubmit={handleAddLog} className="mt-5 space-y-4">
                        <div><label htmlFor="log-trail" className="mb-2 block text-xs font-bold text-on-surface">Trail</label><select id="log-trail" value={logTrail} onChange={(event) => setLogTrail(event.target.value)} className="min-h-11 w-full rounded-lg border border-outline-variant bg-surface px-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"><option value="">Select an assigned trail</option>{trailOptions.map((trail) => <option key={trail} value={trail}>{trail}</option>)}</select></div>
                        <div><label htmlFor="log-summary" className="mb-2 block text-xs font-bold text-on-surface">Observation</label><textarea id="log-summary" value={logSummary} onChange={(event) => setLogSummary(event.target.value)} placeholder="Record a concise observation for the duty report" rows={4} className="w-full resize-y rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                        <Button type="submit" size="lg" disabled={!logTrail || !logSummary.trim()} className="min-h-11 cursor-pointer gap-2"><Plus className="h-4 w-4" />Save trail log</Button>
                    </form>
                </section>

                <section aria-labelledby="incident-form-heading" className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs md:p-6">
                    <div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800"><FileWarning className="h-5 w-5" /></span><div><p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Incident log</p><h2 id="incident-form-heading" className="mt-1 text-lg font-bold text-on-surface">Record an incident</h2></div></div>
                    <form onSubmit={handleAddIncident} className="mt-5 space-y-4">
                        <div className="grid gap-3 sm:grid-cols-2"><div><label htmlFor="incident-trail" className="mb-2 block text-xs font-bold text-on-surface">Trail</label><select id="incident-trail" value={incidentTrail} onChange={(event) => setIncidentTrail(event.target.value)} className="min-h-11 w-full rounded-lg border border-outline-variant bg-surface px-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"><option value="">Select an assigned trail</option>{trailOptions.map((trail) => <option key={trail} value={trail}>{trail}</option>)}</select></div><div><label htmlFor="incident-severity" className="mb-2 block text-xs font-bold text-on-surface">Severity</label><select id="incident-severity" value={incidentSeverity} onChange={(event) => setIncidentSeverity(event.target.value)} className="min-h-11 w-full rounded-lg border border-outline-variant bg-surface px-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"><option>Low</option><option>Moderate</option><option>High</option></select></div></div>
                        <div><label htmlFor="incident-summary" className="mb-2 block text-xs font-bold text-on-surface">What happened?</label><textarea id="incident-summary" value={incidentSummary} onChange={(event) => setIncidentSummary(event.target.value)} placeholder="Describe the incident and any immediate action taken" rows={4} className="w-full resize-y rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                        <Button type="submit" size="lg" disabled={!incidentTrail || !incidentSummary.trim()} className="min-h-11 cursor-pointer gap-2"><Plus className="h-4 w-4" />Save incident</Button>
                    </form>
                </section>
            </div>

            <section style={{ transitionDelay: '350ms' }} aria-labelledby="report-records-heading" className={`rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs transition-all duration-700 ease-out md:p-6 ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Duty records</p><h2 id="report-records-heading" className="mt-1 text-lg font-bold text-on-surface">Review field activity</h2></div><p className="text-xs text-on-surface-variant">Operational day {operationalDate}</p></div>
                <div className="mt-5 grid grid-cols-1 gap-1 rounded-xl bg-surface-container p-1 sm:grid-cols-3">
                    {tabs.map((tab) => <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} aria-pressed={activeTab === tab.id} className={`min-h-11 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeTab === tab.id ? 'bg-primary text-on-secondary shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>{tab.label} <span className="ml-1 opacity-75">({tab.count})</span></button>)}
                </div>

                <div className="mt-5">
                    {activeTab === 'logs' && (trailLogs.length > 0 ? <div className="space-y-3">{trailLogs.map((log) => <div key={log.id} className="rounded-xl border border-outline-variant/30 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold text-on-surface">{log.trail}</p><StaffStatusBadge status="Resolved" label="Recorded" /></div><p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{log.summary}</p><p className="mt-3 text-xs text-on-surface-variant">{log.date} · {formatTime(log.createdAt)} · {log.createdBy}</p></div>)}</div> : <StaffEmptyState icon={ClipboardList} title="No trail logs yet" description="Use the daily log form above to record your first observation for this duty." />)}
                    {activeTab === 'incidents' && (incidents.length > 0 ? <div className="space-y-3">{incidents.map((incident) => <div key={incident.id} className="rounded-xl border border-red-200 bg-red-50/50 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold text-on-surface">{incident.trail} · {incident.severity}</p><StaffStatusBadge status={incident.status} /></div><p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{incident.summary}</p><p className="mt-3 text-xs text-on-surface-variant">{incident.date} · {formatTime(incident.createdAt)} · {incident.createdBy}</p></div>)}</div> : <StaffEmptyState icon={FileWarning} title="No incidents recorded" description="Incidents you add will appear here for review and follow-up." />)}
                    {activeTab === 'checkins' && (todayPasses.length > 0 ? <div className="space-y-2">{todayPasses.map((pass) => <div key={pass.id} className="flex flex-col gap-3 rounded-xl border border-outline-variant/30 p-4 sm:flex-row sm:items-center"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><MapPin className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-on-surface">{pass.hikerName}</p><p className="mt-1 truncate text-xs text-on-surface-variant">{pass.id} · {pass.trail}</p></div><StaffStatusBadge status={checkIns[pass.id] ? 'Checked in' : 'Pending check-in'} /><Link to={`/staff/verify?pass=${encodeURIComponent(pass.id)}`} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-outline-variant px-3 text-xs font-semibold text-on-surface hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Open pass</Link></div>)}</div> : <StaffEmptyState icon={Check} title="No passes available" description="Assigned passes will appear here when a group has a booking record." />)}
                </div>
            </section>
        </div>
    );
}
