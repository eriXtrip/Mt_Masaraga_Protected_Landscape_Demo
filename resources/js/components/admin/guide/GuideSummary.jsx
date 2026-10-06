import { UserCheck, Star, Mountain, Clock } from 'lucide-react';
import KeyFigures from '../dashboard/KeyFigures';

export default function GuideSummary({ guides }) {
    const activeGuides = guides.filter((g) => g.status === 'Active');
    const onLeaveGuides = guides.filter((g) => g.status === 'On Leave');
    const accreditedGuides = guides.filter((g) => g.certification === 'DENR Accredited');

    const totalClimbs = guides.reduce((sum, g) => sum + (g.totalClimbs || 0), 0);

    const avgRating = guides.length
        ? (guides.reduce((sum, g) => sum + (g.rating || 0), 0) / guides.length).toFixed(1)
        : '0';

    const uniqueTrails = [...new Set(guides.flatMap((g) => g.assignedTrails || []))];

    const kpis = [
        {
            icon: UserCheck,
            value: String(guides.length),
            label: 'Total guides',
            sub: `${activeGuides.length} active · ${onLeaveGuides.length} on leave`,
        },
        {
            icon: Star,
            value: avgRating,
            label: 'Avg rating',
            sub: `${totalClimbs} total climbs led`,
        },
        {
            icon: Mountain,
            value: String(uniqueTrails.length),
            label: 'Trail coverage',
            sub: uniqueTrails.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(', ') || 'None assigned',
        },
        {
            icon: Clock,
            value: String(accreditedGuides.length),
            label: 'Accredited',
            sub: `${guides.length - accreditedGuides.length} provisional or pending`,
        },
    ];

    return <KeyFigures kpis={kpis} />;
}
