import { useState } from 'react';
import { Map, Phone, Leaf, Scale } from 'lucide-react';
import ResourceCard from '../../components/features/ResourceCard';
import LiabilityWaiverDocument from '../../components/features/LiabilityWaiverDocument';
import PrintableDocumentModal from '../../components/features/PrintableDocumentModal';
import { A4_DOCUMENT } from '../../lib/printImage';

import { ABOUT_RESOURCES as resources } from '../../mockData';
import { useInView } from '@/hooks/useInView';

const WAIVER_CODE = 'MMP-LW-001';

export default function PreperationResource() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const [isWaiverOpen, setIsWaiverOpen] = useState(false);

    const issuedAt = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    const waiverDocuments = [
        {
            id: WAIVER_CODE,
            fileName: 'liability-waiver.png',
            label: 'Liability Waiver',
            meta: WAIVER_CODE,
            widthInches: A4_DOCUMENT.widthInches,
            heightInches: A4_DOCUMENT.heightInches,
            content: (
                <LiabilityWaiverDocument
                    documentCode={WAIVER_CODE}
                    issuedAt={issuedAt}
                />
            ),
        },
    ];

    return (
        <section ref={sectionRef} className="w-full px-6 py-16 md:px-12 lg:px-16 overflow-hidden">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div
                    className={`mx-auto mb-12 max-w-2xl text-center transition-all duration-700 ease-out ${isInView
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                        }`}
                >
                    <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
                        Preparation Resources
                    </h2>
                    <p className="text-sm leading-relaxed text-on-surface-variant sm:text-base">
                        Essential guides and maps to ensure a safe and responsible hike.
                    </p>
                </div>

                {/* Resource Cards Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
                    {resources.map((resource, index) => (
                        <div
                            key={resource.title}
                            style={{ transitionDelay: `${200 + index * 125}ms` }}
                            className={`transition-all duration-700 ease-out ${isInView
                                    ? 'opacity-100 translate-y-0 scale-100'
                                    : 'opacity-0 translate-y-8 scale-95'
                                }`}
                        >
                            <ResourceCard {...resource} />
                        </div>
                    ))}

                    <div
                        style={{ transitionDelay: `${200 + resources.length * 125}ms` }}
                        className={`transition-all duration-700 ease-out ${isInView
                                ? 'opacity-100 translate-y-0 scale-100'
                                : 'opacity-0 translate-y-8 scale-95'
                            }`}
                    >
                        <ResourceCard
                            icon={Scale}
                            title="Liability Waiver"
                            description="Read the four clauses you accept before booking. Printed copies are signed at jump-off."
                            actionLabel="Read & download"
                            onAction={() => setIsWaiverOpen(true)}
                        />
                    </div>
                </div>
            </div>

            <PrintableDocumentModal
                isOpen={isWaiverOpen}
                onClose={() => setIsWaiverOpen(false)}
                eyebrow="Read before you book"
                title="Mount Masaraga liability waiver"
                description="Accepted once per booking and countersigned by your guide at jump-off."
                documents={waiverDocuments}
            />
        </section>
    );
}
