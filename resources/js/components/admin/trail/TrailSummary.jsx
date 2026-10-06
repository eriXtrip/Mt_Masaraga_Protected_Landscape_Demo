import { Mountain, TrendingUp, Clock, MapPin } from 'lucide-react';
import KeyFigures from '../dashboard/KeyFigures';

export default function TrailSummary({ trails }) {
    const activeTrails = trails.filter((t) => t.status === 'Active');
    const draftTrails = trails.filter((t) => t.status === 'Draft');
    const featuredTrails = trails.filter((t) => t.featured);

    const avgRating = trails.length
        ? (trails.reduce((sum, t) => {
              const rating = parseFloat(t.difficultyRating) || 0;
              return sum + rating;
          }, 0) / trails.length).toFixed(1)
        : '0';

    const kpis = [
        {
            icon: Mountain,
            value: String(trails.length),
            label: 'Total trails',
            sub: `${activeTrails.length} active, ${draftTrails.length} draft`,
        },
        {
            icon: TrendingUp,
            value: `${avgRating}/9`,
            label: 'Avg difficulty',
            sub: `${featuredTrails.length} featured trail${featuredTrails.length !== 1 ? 's' : ''}`,
        },
        {
            icon: Clock,
            value: String(activeTrails.length),
            label: 'Active trails',
            sub: activeTrails.map((t) => t.trailClass).join(', ') || 'None',
        },
        {
            icon: MapPin,
            value: String(trails.reduce((sum, t) => sum + (t.waypoints?.length || 0), 0)),
            label: 'Total waypoints',
            sub: `${trails.reduce((sum, t) => sum + (t.highlights?.length || 0), 0)} highlights`,
        },
    ];

    return <KeyFigures kpis={kpis} />;
}
