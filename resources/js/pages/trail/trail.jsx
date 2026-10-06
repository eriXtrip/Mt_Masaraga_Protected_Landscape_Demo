import TrailHero from './TrailHero';
import TrailStats from './TrailStats';
import TrailOverview from './TrailOverview';
import TrailGallery from './TrailGallery';
import TrailRequirment from './TrailRequirment';
import TrailExperience from './TrailExperience';
import { TrailElevationProfile } from '../../components/charts';

import { useParams, Navigate } from 'react-router-dom';
import { TRAILS } from '../../mockData';

export default function Trail() {
    const { id } = useParams();
    const trailId = id;
    const trail = TRAILS[trailId];

    if (!trail) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex min-h-dvh flex-col bg-surface">
            <main className="flex-1 lg:-mt-14 p-4 sm:p-10 lg:p-20">
                <TrailHero trail={trail} />
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 mt-10 ">
                    <div className="flex flex-col gap-8 col-span-4">
                        <TrailStats trail={trail} />
                        <TrailOverview trail={trail} />
                        <TrailGallery trail={trail} />
                    </div>
                    <div className="flex flex-col gap-8 col-span-4 lg:col-span-2">
                        <TrailRequirment />
                        <TrailElevationProfile trail={trail} className={"rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs transition-colors hover:border-primary/30 hover:shadow-sm"} />
                        <TrailExperience trail={trail} />
                    </div>
                </div>
            </main>
        </div>
    );
}
