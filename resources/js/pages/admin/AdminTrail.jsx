import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useAdminStore, createTrail, updateTrail } from '../../state/adminStore';
import { Button } from '@/components/ui/button';
import TrailSummary from '../../components/admin/trail/TrailSummary';
import TrailFilters from '../../components/admin/trail/TrailFilters';
import TrailList from '../../components/admin/trail/TrailList';
import TrailDetail from '../../components/admin/trail/TrailDetail';
import TrailEditForm from '../../components/admin/trail/TrailEditForm';

export default function AdminTrail() {
    const { trails } = useAdminStore();
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedTrail, setSelectedTrail] = useState(null);
    const [editingTrail, setEditingTrail] = useState(null);

    const filteredTrails = trails.filter((trail) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            !term ||
            trail.name.toLowerCase().includes(term) ||
            trail.difficultyLabel.toLowerCase().includes(term) ||
            trail.trailClass.toLowerCase().includes(term);
        const matchesDifficulty = difficultyFilter === 'All' || trail.difficultyLabel === difficultyFilter;
        const matchesStatus = statusFilter === 'All' || trail.status === statusFilter;
        return matchesSearch && matchesDifficulty && matchesStatus;
    });

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
                            Admin Console · Trails
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                            Trails
                        </h1>
                        <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">
                            Manage trail information, difficulty ratings, waypoints, and availability.
                        </p>
                    </div>

                    <Button
                        size="lg"
                        className="h-11! shrink-0 gap-2"
                        onClick={() => setEditingTrail({ isNew: true })}
                    >
                        <Plus className="h-4 w-4" />
                        Add Trail
                    </Button>
                </header>

                <div
                    style={{ transitionDelay: '150ms' }}
                    className={`transition-all duration-700 ease-out ${isInView
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                        }`}
                >
                    <TrailSummary trails={trails} />
                </div>

                <div
                    style={{ transitionDelay: '250ms' }}
                    className={`transition-all duration-700 ease-out ${isInView
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                        }`}
                >
                    <TrailFilters
                        searchTerm={searchTerm}
                        difficultyFilter={difficultyFilter}
                        statusFilter={statusFilter}
                        resultCount={filteredTrails.length}
                        totalCount={trails.length}
                        onSearch={setSearchTerm}
                        onDifficulty={setDifficultyFilter}
                        onStatus={setStatusFilter}
                    />
                </div>

                <div
                    style={{ transitionDelay: '350ms' }}
                    className={`transition-all duration-700 ease-out ${isInView
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                        }`}
                >
                    <TrailList
                        trails={filteredTrails}
                        onSelect={setSelectedTrail}
                    />
                </div>
            </div>

            {selectedTrail && (
                <TrailDetail
                    trail={selectedTrail}
                    onClose={() => setSelectedTrail(null)}
                    onEdit={(trail) => { setSelectedTrail(null); setEditingTrail(trail); }}
                />
            )}

            {editingTrail && (
                <TrailEditForm
                    trail={editingTrail.isNew ? null : editingTrail}
                    onClose={() => setEditingTrail(null)}
                    onSave={(updatedTrail) => {
                        if (editingTrail.isNew) {
                            createTrail(updatedTrail);
                        } else {
                            updateTrail(editingTrail.id, updatedTrail);
                        }
                        setEditingTrail(null);
                    }}
                />
            )}
        </>
    );
}
