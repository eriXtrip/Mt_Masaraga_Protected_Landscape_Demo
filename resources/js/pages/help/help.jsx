

import FAQ from './FAQ';
import HelpSearchbar from './HelpCta';
import StillHaveQuestionCTA from './StillHaveQuestionCTA';

export default function Help() {
    return (
        <div className="flex min-h-dvh flex-col bg-surface">
            <main className="-mt-13 flex-1 lg:-mt-14">
                <HelpSearchbar />
                <FAQ />
                <StillHaveQuestionCTA />
            </main>
        </div>
    );
}