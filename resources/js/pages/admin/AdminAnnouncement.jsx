import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { Button } from '@/components/ui/button';
import {
    useAdminStore,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    sendAnnouncement,
} from '../../state/adminStore';
import { AnnouncementList, AnnouncementSummary, AnnouncementForm } from '../../components/admin/announcement';

export default function AdminAnnouncement() {
    const { profile, announcements } = useAdminStore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

    const handleOpenForm = (item = null) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingItem(null);
    };

    const handleSave = async (data, id) => {
        if (id) {
            updateAnnouncement(id, data);
        } else {
            const newAnnouncement = {
                ...data,
                id: `ANN-${Date.now()}`,
                createdAt: new Date().toISOString(),
                author: profile?.name || 'Admin',
            };
            createAnnouncement(newAnnouncement);
        }
        handleCloseForm();
    };

    const handleDeleteAnnouncement = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            deleteAnnouncement(id);
        }
    };

    const handleSendAnnouncement = async (id) => {
        sendAnnouncement(id);
    };

    return (
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
                        Admin Console · Announcements
                    </p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                        Manage Announcements
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-on-surface-variant md:text-base">
                        Broadcast official announcements to hikers, park staff, and administrators.
                    </p>
                </div>

                <Button
                    variant="default"
                    size="lg"
                    className="h-11! gap-2 shrink-0"
                    onClick={() => handleOpenForm()}
                >
                    <Plus className="h-4 w-4" />
                    New Announcement
                </Button>
            </header>

            <div
                style={{ transitionDelay: '150ms' }}
                className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                    }`}
            >
                <AnnouncementSummary announcements={announcements} />
            </div>

            <div
                style={{ transitionDelay: '300ms' }}
                className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                    }`}
            >
                <AnnouncementList
                    announcements={announcements}
                    onCreate={() => handleOpenForm()}
                    onEdit={(item) => handleOpenForm(item)}
                    onDelete={handleDeleteAnnouncement}
                    onSend={handleSendAnnouncement}
                />
            </div>

            {isFormOpen && (
                <AnnouncementForm
                    item={editingItem}
                    onSave={handleSave}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
}