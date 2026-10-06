import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { Button } from '@/components/ui/button';
import {
    useContentStore,
    addNews,
    updateNews,
    deleteNews,
    addAward,
    updateAward,
    deleteAward,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    updateAboutHero,
    addAboutZone,
    updateAboutZone,
    deleteAboutZone,
    addAboutResource,
    updateAboutResource,
    deleteAboutResource,
    addFaqCategory,
    updateFaqCategory,
    deleteFaqCategory,
} from '../../state/contentStore';
import {
    ContentTabs,
    ContentSummary,
    NewsFilters,
    NewsList,
    NewsForm,
    AwardsList,
    AwardForm,
    GalleryGrid,
    GalleryForm,
    ContentDetailModal,
    AboutHeroPreview,
    AboutHeroForm,
    AboutZonesList,
    AboutZoneForm,
    AboutResourcesList,
    AboutResourceForm,
    FaqList,
    FaqForm,
} from '../../components/admin/content';
import { toast } from '../../components/ui/toast';

export default function AdminContent() {
    const { news, awards, gallery, about, faq } = useContentStore();
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

    const [activeTab, setActiveTab] = useState('news');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const [formOpen, setFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [detailItem, setDetailItem] = useState(null);
    const [detailType, setDetailType] = useState(null);
    const [aboutFormType, setAboutFormType] = useState(null);

    const filteredNews = news.filter((item) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = !term || item.title.toLowerCase().includes(term) || item.leadParagraph?.toLowerCase().includes(term);
        const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const openCreate = () => {
        setEditingItem(null);
        setFormOpen(true);
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setFormOpen(true);
    };

    const openDetail = (item) => {
        setDetailItem(item);
        setDetailType(activeTab === 'news' ? 'news' : 'award');
    };

    const handleDelete = (id) => {
        if (activeTab === 'news') {
            deleteNews(id);
            toast.add({ type: 'success', title: 'News deleted', description: 'The news item has been removed.' });
        } else if (activeTab === 'awards') {
            deleteAward(id);
            toast.add({ type: 'success', title: 'Award deleted', description: 'The award has been removed.' });
        } else if (activeTab === 'gallery') {
            deleteGalleryItem(id);
            toast.add({ type: 'success', title: 'Gallery item deleted', description: 'The image has been removed.' });
        } else if (activeTab === 'faq') {
            deleteFaqCategory(id);
            toast.add({ type: 'success', title: 'FAQ category deleted', description: 'The FAQ category has been removed.' });
        }
    };

    const handleSaveNews = (data) => {
        if (editingItem) {
            updateNews(editingItem.id, data);
            toast.add({ type: 'success', title: 'News updated', description: 'The news item has been updated.' });
        } else {
            addNews(data);
            toast.add({ type: 'success', title: 'News created', description: 'The news item has been published.' });
        }
        setFormOpen(false);
        setEditingItem(null);
    };

    const handleSaveAward = (data) => {
        if (editingItem) {
            updateAward(editingItem.id, data);
            toast.add({ type: 'success', title: 'Award updated', description: 'The award has been updated.' });
        } else {
            addAward(data);
            toast.add({ type: 'success', title: 'Award created', description: 'The award has been added.' });
        }
        setFormOpen(false);
        setEditingItem(null);
    };

    const handleSaveGallery = (data) => {
        if (editingItem) {
            updateGalleryItem(editingItem.id, data);
            toast.add({ type: 'success', title: 'Image updated', description: 'The gallery image has been updated.' });
        } else {
            addGalleryItem(data);
            toast.add({ type: 'success', title: 'Image added', description: 'The image has been added to the gallery.' });
        }
        setFormOpen(false);
        setEditingItem(null);
    };

    const handleSaveHero = (data) => {
        updateAboutHero(data);
        toast.add({ type: 'success', title: 'About section updated', description: 'The About section has been updated.' });
        setFormOpen(false);
        setEditingItem(null);
        setAboutFormType(null);
    };

    const handleSaveZone = (data) => {
        if (editingItem) {
            updateAboutZone(editingItem.id, data);
            toast.add({ type: 'success', title: 'About Image updated', description: 'The about image has been updated.' });
        } else {
            addAboutZone(data);
            toast.add({ type: 'success', title: 'About Image added', description: 'The about image has been added.' });
        }
        setFormOpen(false);
        setEditingItem(null);
        setAboutFormType(null);
    };

    const handleSaveResource = (data) => {
        if (editingItem) {
            updateAboutResource(editingItem.id, data);
            toast.add({ type: 'success', title: 'Resource updated', description: 'The resource has been updated.' });
        } else {
            addAboutResource(data);
            toast.add({ type: 'success', title: 'Resource added', description: 'The resource has been added.' });
        }
        setFormOpen(false);
        setEditingItem(null);
        setAboutFormType(null);
    };

    const handleSaveFaq = (data) => {
        if (editingItem) {
            updateFaqCategory(editingItem.id, data);
            toast.add({ type: 'success', title: 'FAQ updated', description: 'The FAQ category has been updated.' });
        } else {
            addFaqCategory(data);
            toast.add({ type: 'success', title: 'FAQ created', description: 'The FAQ category has been created.' });
        }
        setFormOpen(false);
        setEditingItem(null);
    };

    const createLabel = activeTab === 'news' ? 'news item' : activeTab === 'awards' ? 'award' : activeTab === 'faq' ? 'FAQ category' : activeTab === 'about' ? 'about image' : 'item';

    return (
        <>
            <div ref={sectionRef} className="space-y-6 md:space-y-8">
                <header
                    style={{ transitionDelay: '0ms' }}
                    className={`flex flex-col gap-3 md:flex-row md:items-end md:justify-between transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
                >
                    <div className="max-w-2xl space-y-1.5">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Admin Console · Content</p>
                        <h1 className="text-2xl font-bold tracking-tight text-on-surface md:text-3xl">Content Management</h1>
                        <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">
                            Manage news, awards, gallery, About page, and FAQ displayed on the public site.
                        </p>
                    </div>
                    {activeTab !== 'about' && (
                        <Button variant="default" size="lg" className="h-11! shrink-0 gap-2 cursor-pointer" onClick={openCreate}>
                            <Plus className="h-4 w-4" />
                            Create {createLabel}
                        </Button>
                    )}
                </header>

                <div style={{ transitionDelay: '150ms' }} className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                    <ContentTabs activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setSearchTerm(''); setCategoryFilter('All'); setFormOpen(false); setEditingItem(null); }} />
                </div>

                <div style={{ transitionDelay: '350ms' }} className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                    {activeTab === 'news' && (
                        <div className="space-y-4">
                            <NewsFilters searchTerm={searchTerm} categoryFilter={categoryFilter} onSearch={setSearchTerm} onCategory={setCategoryFilter} />
                            <NewsList news={filteredNews} onView={openDetail} onEdit={openEdit} onDelete={handleDelete} />
                        </div>
                    )}

                    {activeTab === 'awards' && (
                        <AwardsList awards={awards} onView={openDetail} onEdit={openEdit} onDelete={handleDelete} />
                    )}

                    {activeTab === 'gallery' && (
                        <GalleryGrid items={gallery} onEdit={openEdit} onDelete={handleDelete} />
                    )}

                    {activeTab === 'about' && (
                        <div className="space-y-6">
                            <AboutHeroPreview hero={about?.hero} onEdit={() => { setEditingItem(about?.hero); setAboutFormType('hero'); setFormOpen(true); }} />

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-bold text-on-surface">About Images</h3>
                                    <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer" onClick={() => { setEditingItem(null); setAboutFormType('zone'); setFormOpen(true); }}>
                                        <Plus className="h-3.5 w-3.5" /> Add about image
                                    </Button>
                                </div>
                                <AboutZonesList zones={about?.zones} onEdit={(z) => { setEditingItem(z); setAboutFormType('zone'); setFormOpen(true); }} onDelete={(id) => { deleteAboutZone(id); toast.add({ type: 'success', title: 'About Image deleted', description: 'The about image has been removed.' }); }} />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-bold text-on-surface">Preparation Resources</h3>
                                    <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer" onClick={() => { setEditingItem(null); setAboutFormType('resource'); setFormOpen(true); }}>
                                        <Plus className="h-3.5 w-3.5" /> Add resource
                                    </Button>
                                </div>
                                <AboutResourcesList resources={about?.resources} onEdit={(r) => { setEditingItem(r); setAboutFormType('resource'); setFormOpen(true); }} onDelete={(id) => { deleteAboutResource(id); toast.add({ type: 'success', title: 'Resource deleted', description: 'The resource has been removed.' }); }} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'faq' && (
                        <FaqList categories={faq} onEdit={openEdit} onDelete={handleDelete} />
                    )}
                </div>
            </div>

            {formOpen && activeTab === 'news' && (
                <NewsForm item={editingItem} onSave={handleSaveNews} onClose={() => { setFormOpen(false); setEditingItem(null); }} />
            )}

            {formOpen && activeTab === 'awards' && (
                <AwardForm item={editingItem} onSave={handleSaveAward} onClose={() => { setFormOpen(false); setEditingItem(null); }} />
            )}

            {formOpen && activeTab === 'gallery' && (
                <GalleryForm item={editingItem} onSave={handleSaveGallery} onClose={() => { setFormOpen(false); setEditingItem(null); }} />
            )}

            {formOpen && activeTab === 'about' && aboutFormType === 'hero' && (
                <AboutHeroForm hero={editingItem} onSave={handleSaveHero} onClose={() => { setFormOpen(false); setEditingItem(null); setAboutFormType(null); }} />
            )}

            {formOpen && activeTab === 'about' && aboutFormType === 'zone' && (
                <AboutZoneForm item={editingItem} onSave={handleSaveZone} onClose={() => { setFormOpen(false); setEditingItem(null); setAboutFormType(null); }} />
            )}

            {formOpen && activeTab === 'about' && aboutFormType === 'resource' && (
                <AboutResourceForm item={editingItem} onSave={handleSaveResource} onClose={() => { setFormOpen(false); setEditingItem(null); setAboutFormType(null); }} />
            )}

            {formOpen && activeTab === 'faq' && (
                <FaqForm item={editingItem} onSave={handleSaveFaq} onClose={() => { setFormOpen(false); setEditingItem(null); }} />
            )}

            {detailItem && (
                <ContentDetailModal item={detailItem} type={detailType} onClose={() => { setDetailItem(null); setDetailType(null); }} />
            )}
        </>
    );
}
