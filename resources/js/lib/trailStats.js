import { MapPin, TrendingUp, Clock, Map } from 'lucide-react';

export const TRAIL_STATS = {
    elevation: { icon: MapPin, label: 'Elevation' },
    difficulty: { icon: TrendingUp, label: 'Difficulty' },
    duration: { icon: Clock, label: 'Duration' },
    distance: { icon: Map, label: 'Distance' },
};

export function resolveStat(id, value) {
    const config = TRAIL_STATS[id];
    if (!config) return null;
    return { icon: config.icon, label: config.label, value };
}
