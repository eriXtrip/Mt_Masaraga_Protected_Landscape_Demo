import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useAdminStore, createGuide, updateGuide, deleteGuide } from '../../state/adminStore';
import { Button } from '@/components/ui/button';
import { toast } from '../../components/ui/toast';
import GuideSummary from '../../components/admin/guide/GuideSummary';
import GuideFilters from '../../components/admin/guide/GuideFilters';
import GuideList from '../../components/admin/guide/GuideList';
import GuideDetail from '../../components/admin/guide/GuideDetail';
import GuideEditForm from '../../components/admin/guide/GuideEditForm';
import { GuidePerformanceChart } from '../../components/charts';
import useGuideStats from '@/hooks/useGuideStats';

export default function AdminGuides() {
    const { guides, bookings } = useAdminStore();
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [certificationFilter, setCertificationFilter] = useState('All');
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [editingGuide, setEditingGuide] = useState(null);

    const allGuideStats = useGuideStats(guides, bookings);

    const filteredGuides = allGuideStats.filter((guide) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            !term ||
            guide.name.toLowerCase().includes(term) ||
            guide.email.toLowerCase().includes(term) ||
            guide.specialization.toLowerCase().includes(term) ||
            guide.certification.toLowerCase().includes(term);
        const matchesStatus = statusFilter === 'All' || guide.status === statusFilter;
        const matchesCert = certificationFilter === 'All' || guide.certification === certificationFilter;
        return matchesSearch && matchesStatus && matchesCert;
    });

    const handleStatusChange = (guideId, newStatus) => {
        updateGuide(guideId, { status: newStatus });
        const guide = guides.find((g) => g.id === guideId);
        toast.add({
            type: 'success',
            title: `Guide ${newStatus === 'Active' ? 'reactivated' : newStatus === 'On Leave' ? 'put on leave' : 'deactivated'}`,
            description: `${guide?.name || 'Guide'} has been ${newStatus === 'Active' ? 'reactivated' : newStatus === 'On Leave' ? 'put on leave' : 'deactivated'}.`,
        });
        setSelectedGuide(null);
    };

    const handleSaveGuide = (guideData) => {
        if (guideData.id) {
            updateGuide(guideData.id, guideData);
            toast.add({
                type: 'success',
                title: 'Guide updated',
                description: `${guideData.name}'s profile has been updated.`,
            });
        } else {
            createGuide(guideData);
            toast.add({
                type: 'success',
                title: 'Guide added',
                description: `${guideData.name} has been added to the registry.`,
            });
        }
        setEditingGuide(null);
    };

    return (
        <>
            <div ref={sectionRef} className="space-y-6 md:space-y-8">
                <header
                    style={{ transitionDelay: '0ms' }}
                    className={`flex flex-col gap-3 md:flex-row md:items-end md:justify-between transition-all duration-700 ease-out ${isInView
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                        }`}
                >
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                            Admin Console · Guides
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                            Guides
                        </h1>
                        <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">
                            Accredited guide registry, certifications, and trail assignments.
                        </p>
                    </div>

                    <Button
                        size="lg"
                        className="h-11! shrink-0 gap-2"
                        onClick={() => setEditingGuide({ isNew: true })}
                    >
                        <Plus className="h-4 w-4" />
                        Add Guide
                    </Button>
                </header>

                <div
                    style={{ transitionDelay: '150ms' }}
                    className={`transition-all duration-700 ease-out ${isInView
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                        }`}
                >
                    <GuideSummary guides={guides} />
                </div>

                <div
                    style={{ transitionDelay: '200ms' }}
                    className={`rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs hover:border-primary/30 hover:shadow-sm transition-all duration-700 ease-out ${isInView
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                        }`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-on-surface">Guide Performance</h3>
                    </div>
                    <GuidePerformanceChart guides={guides} bookings={bookings} />
                </div>

                <div
                    style={{ transitionDelay: '250ms' }}
                    className={`transition-all duration-700 ease-out ${isInView
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                        }`}
                >
                    <GuideFilters
                        searchTerm={searchTerm}
                        statusFilter={statusFilter}
                        certificationFilter={certificationFilter}
                        resultCount={filteredGuides.length}
                        totalCount={guides.length}
                        onSearch={setSearchTerm}
                        onStatus={setStatusFilter}
                        onCertification={setCertificationFilter}
                    />
                </div>

                <div
                    style={{ transitionDelay: '350ms' }}
                    className={`transition-all duration-700 ease-out ${isInView
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                        }`}
                >
                    <GuideList
                        guides={filteredGuides}
                        onSelect={setSelectedGuide}
                    />
                </div>
            </div>

            {selectedGuide && (
                <GuideDetail
                    guide={selectedGuide}
                    onAction={(action) => handleStatusChange(selectedGuide.id, action === 'activate' ? 'Active' : action === 'leave' ? 'On Leave' : 'Inactive')}
                    onClose={() => setSelectedGuide(null)}
                />
            )}

            {editingGuide && (
                <GuideEditForm
                    guide={editingGuide.isNew ? null : editingGuide}
                    onClose={() => setEditingGuide(null)}
                    onSave={handleSaveGuide}
                />
            )}
        </>
    );
}
