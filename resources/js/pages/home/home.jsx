import Cta from './cta';
import ExploreTrail from './ExploreTrail';
import Gallery from './Gallery';
import Experience from './Experience';
import Awards from './Awards';
import News from './News';

export default function Home() {
    return (
        <div className="flex min-h-dvh flex-col bg-surface">
            <main className="-mt-13 flex-1 lg:-mt-14">
                <Cta />
                <ExploreTrail />
                <Gallery />
                <Experience />
                <Awards />
                <News />
            </main>
        </div>
    );
}
