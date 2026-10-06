import Overview from "./Overview";
import TrailShowcase from "./TrailShowcase";
import PreperationResource from "./PreperationResource";

export default function About() {
    return (
        <div className="flex min-h-dvh flex-col bg-surface">
            <main className="-mt-13 flex-1 lg:-mt-14">
                <Overview />
                <TrailShowcase />
                <PreperationResource />
            </main>
        </div>
    );
}