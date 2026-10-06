import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Save, Mountain, Plus, Trash2, Upload, Image, Star, Check } from 'lucide-react';
import { TRAIL_STATS } from '@/lib/trailStats';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDrawerTransition } from '@/hooks/useDrawerTransition';
import { toast } from '@/components/ui/toast';

const DIFFICULTY_OPTIONS = ['Major Climb', 'Moderate-Major', 'Moderate'];
const TRAIL_CLASS_OPTIONS = ['Class 1-3', 'Class 3-4'];
const TECHNICALITY_OPTIONS = ['Low (Scrambling)', 'Moderate (Scrambling)', 'High (Fixed Ropes)'];
const STATUS_OPTIONS = ['Active', 'Draft', 'Closed'];
const WAYPOINT_ICON_OPTIONS = ['start', 'camp', 'summit', 'water', 'view', 'danger'];

const AVAILABLE_REVIEWS = [
    { id: 1, initials: 'ES', name: 'Elena Santos', quote: 'A brutal pure-assault climb! The rope sections tested our grip, but standing at the summit with Mayon in full view was surreal.', date: 'Oct 12, 2024', rating: 5 },
    { id: 2, initials: 'MC', name: 'Marcus Chen', quote: 'Strenuous hike with zero flat sections. Excellent PAMB local guides who kept our pace safe through the mossy ridge.', date: 'Sep 28, 2024', rating: 5 },
    { id: 3, initials: 'SJ', name: 'Sarah Johnson', quote: 'Trail is technical and slippery when wet. Bring gloves for the rope segments and plenty of water!', date: 'Sep 15, 2024', rating: 4 },
    { id: 4, initials: 'RV', name: 'Ramon Valdez', quote: 'Challenging day-climb. Completed in 9 hours total. The forest cover keeps you cool until the final ridge assault.', date: 'Aug 30, 2024', rating: 4.5 },
    { id: 5, initials: 'AL', name: 'Anna Lopez', quote: 'Top-tier adventure in Albay. The pitcher plants near the top were amazing to see in their natural habitat.', date: 'Aug 14, 2024', rating: 5 },
    { id: 6, initials: 'JM', name: 'Jayson Mendoza', quote: 'Great alternative to Amtic! The initial walk through the farmlands was pleasant before we hit the steep forest trail.', date: 'Nov 04, 2024', rating: 5 },
    { id: 7, initials: 'KL', name: 'Kristine Lim', quote: 'Start early to beat the heat on the open plantation sections. Gorgeous views of the valley as you gain height!', date: 'Oct 19, 2024', rating: 4.5 },
    { id: 8, initials: 'DR', name: 'Danilo Reyes', quote: 'Well-marked trail guided by local Balogo rangers. A bit muddy near the high junction, but manageable.', date: 'Sep 02, 2024', rating: 4 },
    { id: 9, initials: 'CP', name: 'Clara Pascual', quote: 'Less crowded route with wonderful countryside scenery. Highly recommended for experienced day hikers!', date: 'Aug 22, 2024', rating: 5 },
    { id: 10, initials: 'BT', name: 'Ben Torres', quote: 'Challenging yet rewarding trek. Make sure to bring enough water as there are no streams along this ridge.', date: 'Jul 11, 2024', rating: 4.5 },
];

function FormField({ label, children, required }) {
    return (
        <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-2">{children}</div>
        </div>
    );
}

function PillSelector({ options, value, onChange }) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
                <button
                    key={opt}
                    type="button"
                    onClick={() => onChange(opt)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer ${value === opt
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                        }`}
                >
                    {opt}
                </button>
            ))}
        </div>
    );
}

function DynamicList({ items, onAdd, onRemove, onUpdate, fields, label }) {
    return (
        <div className="space-y-3">
            {items.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-outline-variant/20 bg-surface-container-high p-3 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                            {label} {idx + 1}
                        </span>
                        <button
                            type="button"
                            onClick={() => onRemove(idx)}
                            className="rounded-lg p-1 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        {fields.map((field) => (
                            <div key={field.key}>
                                <label className="text-[10px] font-semibold text-on-surface-variant">{field.label}</label>
                                {field.type === 'select' ? (
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {field.options.map((opt) => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => onUpdate(idx, field.key, opt)}
                                                className={`px-2 py-1 text-[10px] font-semibold rounded-lg transition-colors cursor-pointer ${item[field.key] === opt
                                                    ? 'bg-primary text-white'
                                                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-highest'
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <Input
                                        placeholder={field.placeholder}
                                        value={item[field.key] || ''}
                                        onChange={(e) => onUpdate(idx, field.key, e.target.value)}
                                        className="mt-1"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onAdd}
                className="w-full gap-2"
            >
                <Plus className="h-3.5 w-3.5" />
                Add {label}
            </Button>
        </div>
    );
}

function ParagraphList({ paragraphs, onChange }) {
    return (
        <div className="space-y-3">
            {paragraphs.map((text, idx) => (
                <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                            Paragraph {idx + 1}
                        </span>
                        <button
                            type="button"
                            onClick={() => onChange(paragraphs.filter((_, i) => i !== idx))}
                            className="rounded-lg p-1 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    <textarea
                        rows={3}
                        value={text}
                        ref={(node) => {
                            if (node) {
                                node.style.height = 'auto';
                                node.style.height = `${node.scrollHeight}px`;
                            }
                        }}
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3.5 py-2.5 text-sm text-on-surface placeholder:text-outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                    />
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onChange([...paragraphs, ''])}
                className="w-full gap-2"
            >
                <Plus className="h-3.5 w-3.5" />
                Add Paragraph
            </Button>
        </div>
    );
}

function ImageDropZone({ label, image, onDrop, onRemove }) {
    const inputRef = useRef(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer?.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onDrop?.(file);
        }
    }, [onDrop]);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file) {
            onDrop?.(file);
        }
    }, [onDrop]);

    if (image) {
        return (
            <div className="relative rounded-xl border border-outline-variant/20 overflow-hidden group">
                <img
                    src={image.src || image}
                    alt={image.alt || label}
                    className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-inverse-surface/0 group-hover:bg-inverse-surface/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="rounded-lg bg-white/90 p-2 text-on-surface hover:bg-white transition-colors cursor-pointer"
                    >
                        <Upload className="h-4 w-4" />
                    </button>
                    {onRemove && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="rounded-lg bg-red-500/90 p-2 text-white hover:bg-red-500 transition-colors cursor-pointer"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
                {image.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-2">
                        <p className="text-[10px] font-bold text-white truncate">{image.title}</p>
                        {image.subtitle && <p className="text-[9px] text-white/80 truncate">{image.subtitle}</p>}
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        );
    }

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-colors cursor-pointer ${isDragOver
                ? 'border-primary bg-primary/5'
                : 'border-outline-variant/40 hover:border-primary/40 hover:bg-surface-container-high'
                }`}
        >
            <span className={`h-10 w-10 rounded-xl flex items-center justify-center ${isDragOver ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                <Upload className="h-5 w-5" />
            </span>
            <div className="text-center">
                <p className="text-xs font-semibold text-on-surface">
                    {isDragOver ? 'Drop image here' : 'Click or drag image'}
                </p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                    PNG, JPG up to 5MB
                </p>
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}

function GalleryDropZone({ images, onAdd, onRemove }) {
    const inputRef = useRef(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer?.files;
        if (files) {
            Array.from(files).forEach((file) => {
                if (file.type.startsWith('image/')) {
                    onAdd?.(file);
                }
            });
        }
    }, [onAdd]);

    const handleFileChange = useCallback((e) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                onAdd?.(file);
            });
        }
    }, [onAdd]);

    return (
        <div className="space-y-3">
            {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                    {images.map((img, idx) => (
                        <div key={img.id || idx} className="relative rounded-xl border border-outline-variant/20 overflow-hidden group">
                            <img
                                src={img.src}
                                alt={img.alt || ''}
                                className="w-full h-24 object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => onRemove(idx)}
                                className="absolute top-1.5 right-1.5 rounded-lg bg-red-500/90 p-1 text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                            {img.title && (
                                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-1.5">
                                    <p className="text-[9px] font-bold text-white truncate">{img.title}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 transition-colors cursor-pointer ${isDragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant/40 hover:border-primary/40 hover:bg-surface-container-high'
                    }`}
            >
                <span className={`h-8 w-8 rounded-lg flex items-center justify-center ${isDragOver ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    <Image className="h-4 w-4" />
                </span>
                <div className="text-center">
                    <p className="text-[11px] font-semibold text-on-surface">
                        {isDragOver ? 'Drop images here' : 'Add gallery images'}
                    </p>
                    <p className="text-[10px] text-on-surface-variant">
                        Click or drag multiple files
                    </p>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        </div>
    );
}

function ReviewPicker({ selectedReviews, onToggle }) {
    return (
        <div className="space-y-2">
            {AVAILABLE_REVIEWS.map((review) => {
                const isSelected = selectedReviews.some((r) => r.id === review.id);
                return (
                    <button
                        key={review.id}
                        type="button"
                        onClick={() => onToggle(review)}
                        className={`w-full text-left rounded-xl border p-3 transition-all cursor-pointer ${isSelected
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                            : 'border-outline-variant/20 bg-surface-container-high hover:border-outline-variant/40'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${isSelected ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'
                                }`}>
                                {isSelected ? <Check className="h-4 w-4" /> : review.initials}
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-xs font-semibold text-on-surface truncate">{review.name}</p>
                                    <span className="flex items-center gap-0.5 text-[10px] text-amber-600">
                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        {review.rating}
                                    </span>
                                    {review.date && (
                                        <span className="text-[10px] text-outline ml-auto">{review.date}</span>
                                    )}
                                </div>
                                <p className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-2">"{review.quote}"</p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

const DEFAULT_WAYPOINT = { name: '', description: '', icon: 'camp' };
const DEFAULT_HIGHLIGHT = { id: '', label: '', description: '' };
const DEFAULT_ELEVATION = { label: '', elevation: '', x: 0, y: 0, isSummit: false };

export default function TrailEditForm({ trail, onClose, onSave }) {
    const closeButtonRef = useRef(null);
    const { closing, requestClose, handleAnimationEnd } = useDrawerTransition(onClose);

    const [form, setForm] = useState({
        name: '',
        subtitle: '',
        description: '',
        status: 'Active',
        featured: false,
    });

    const [waypoints, setWaypoints] = useState([]);
    const [paragraphs, setParagraphs] = useState(['']);
    const [highlights, setHighlights] = useState([]);
    const [elevationPoints, setElevationPoints] = useState([]);
    const [selectedReviews, setSelectedReviews] = useState([]);
    const [heroImage, setHeroImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [stats, setStats] = useState({
        elevation: '',
        difficulty: '',
        duration: '',
        distance: '',
    });

    useEffect(() => {
        if (trail) {
            setForm({
                name: trail.name || '',
                subtitle: trail.subtitle || '',
                description: trail.description || '',
                status: trail.status || 'Active',
                featured: trail.featured || false,
            });
            setWaypoints(trail.waypoints?.map((w) => ({ ...w })) || []);
            setParagraphs(trail.paragraphs?.length ? [...trail.paragraphs] : ['']);
            setHighlights(trail.highlights?.map((h) => ({ ...h })) || []);
            setElevationPoints(trail.elevationPoints?.map((e) => ({ ...e })) || []);
            setSelectedReviews(trail.reviews || []);
            setHeroImage(trail.image ? { src: trail.image, alt: trail.name } : null);
            setGalleryImages(trail.gallery || []);
            setStats({
                elevation: trail.stats?.find((s) => s.id === 'elevation')?.value || '',
                difficulty: trail.stats?.find((s) => s.id === 'difficulty')?.value || '',
                duration: trail.stats?.find((s) => s.id === 'duration')?.value || '',
                distance: trail.stats?.find((s) => s.id === 'distance')?.value || '',
            });
        }
    }, [trail]);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') requestClose();
        };
        window.addEventListener('keydown', onKeyDown);
        closeButtonRef.current?.focus();
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [requestClose]);

    const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const toggleReview = (review) => {
        setSelectedReviews((prev) => {
            const exists = prev.some((r) => r.id === review.id);
            if (exists) {
                return prev.filter((r) => r.id !== review.id);
            }
            return [...prev, review];
        });
    };

    const handleHeroImageDrop = (file) => {
        const url = URL.createObjectURL(file);
        setHeroImage({ src: url, alt: file.name });
    };

    const handleGalleryImageAdd = (file) => {
        const url = URL.createObjectURL(file);
        setGalleryImages((prev) => [
            ...prev,
            { id: Date.now(), src: url, alt: file.name, title: file.name, subtitle: '' },
        ]);
    };

    const handleSave = () => {
        if (!form.name.trim()) {
            toast.add({ type: 'error', title: 'Validation error', description: 'Trail name is required.' });
            return;
        }
        onSave?.({
            ...trail,
            ...form,
            image: heroImage?.src || trail?.image || null,
            stats: [
                { id: 'elevation', value: stats.elevation },
                { id: 'difficulty', value: stats.difficulty },
                { id: 'duration', value: stats.duration },
                { id: 'distance', value: stats.distance },
            ],
            waypoints,
            paragraphs: paragraphs.filter((p) => p.trim()),
            highlights,
            elevationPoints,
            reviews: selectedReviews,
            gallery: galleryImages,
        });
        toast.add({ type: 'success', title: 'Trail saved', description: `${form.name} has been updated.` });
        requestClose();
    };

    return (
        <div className="fixed inset-0 z-40">
            <div
                className={`absolute inset-0 bg-inverse-surface/60 ${closing ? 'animate-out fade-out animation-duration-300' : 'animate-in fade-in animation-duration-300'} motion-reduce:animate-none`}
                onClick={requestClose}
                aria-hidden="true"
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-label={trail ? `Edit ${trail.name}` : 'Add trail'}
                onAnimationEnd={closing ? handleAnimationEnd : undefined}
                className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface-container-lowest shadow-xl ${closing ? 'animate-out slide-out-to-right animation-duration-300' : 'animate-in slide-in-from-right animation-duration-300'} motion-reduce:animate-none`}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            <Mountain className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-on-surface">
                                {trail ? 'Edit Trail' : 'Add Trail'}
                            </p>
                            <p className="truncate text-xs text-on-surface-variant">
                                {trail ? trail.name : 'Create a new trail'}
                            </p>
                        </div>
                    </div>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={requestClose}
                        aria-label="Close edit form"
                        className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
                    {/* Hero Image */}
                    <FormField label="Hero Image">
                        <ImageDropZone
                            label="Hero image"
                            image={heroImage}
                            onDrop={handleHeroImageDrop}
                            onRemove={() => setHeroImage(null)}
                        />
                    </FormField>

                    {/* Basic Info */}
                    <FormField label="Trail Name" required>
                        <Input
                            placeholder="e.g. Amtic Trail"
                            value={form.name}
                            onChange={(e) => update('name', e.target.value)}
                        />
                    </FormField>

                    <FormField label="Subtitle">
                        <Input
                            placeholder="e.g. Continuous steep assault through tropical rain forest"
                            value={form.subtitle}
                            onChange={(e) => update('subtitle', e.target.value)}
                        />
                    </FormField>

                    <FormField label="Description" required>
                        <textarea
                            rows={3}
                            placeholder="Short description of the trail..."
                            value={form.description}
                            onChange={(e) => update('description', e.target.value)}
                            ref={(node) => {
                                if (node) {
                                    node.style.height = 'auto';
                                    node.style.height = `${node.scrollHeight}px`;
                                }
                            }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3.5 py-2.5 text-sm text-on-surface placeholder:text-outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                        />
                    </FormField>

                    {/* Trail Stats */}
                    <FormField label="Trail Stats">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-outline-variant/20 bg-surface-container-high p-3 space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                    <TRAIL_STATS.elevation.icon className="h-3.5 w-3.5 text-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{TRAIL_STATS.elevation.label}</span>
                                </div>
                                <Input
                                    placeholder="e.g. 1,328m"
                                    value={stats.elevation}
                                    onChange={(e) => setStats((prev) => ({ ...prev, elevation: e.target.value }))}
                                />
                            </div>
                            <div className="rounded-xl border border-outline-variant/20 bg-surface-container-high p-3 space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                    <TRAIL_STATS.difficulty.icon className="h-3.5 w-3.5 text-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{TRAIL_STATS.difficulty.label}</span>
                                </div>
                                <Input
                                    placeholder="e.g. 7/9"
                                    value={stats.difficulty}
                                    onChange={(e) => setStats((prev) => ({ ...prev, difficulty: e.target.value }))}
                                />
                            </div>
                            <div className="rounded-xl border border-outline-variant/20 bg-surface-container-high p-3 space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                    <TRAIL_STATS.duration.icon className="h-3.5 w-3.5 text-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{TRAIL_STATS.duration.label}</span>
                                </div>
                                <Input
                                    placeholder="e.g. 8-10h"
                                    value={stats.duration}
                                    onChange={(e) => setStats((prev) => ({ ...prev, duration: e.target.value }))}
                                />
                            </div>
                            <div className="rounded-xl border border-outline-variant/20 bg-surface-container-high p-3 space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                    <TRAIL_STATS.distance.icon className="h-3.5 w-3.5 text-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{TRAIL_STATS.distance.label}</span>
                                </div>
                                <Input
                                    placeholder="e.g. 9.2km"
                                    value={stats.distance}
                                    onChange={(e) => setStats((prev) => ({ ...prev, distance: e.target.value }))}
                                />
                            </div>
                        </div>
                    </FormField>

                    {/* Status & Featured */}
                    <FormField label="Status" required>
                        <PillSelector
                            options={STATUS_OPTIONS}
                            value={form.status}
                            onChange={(v) => update('status', v)}
                        />
                    </FormField>

                    <FormField label="Featured">
                        <button
                            type="button"
                            onClick={() => update('featured', !form.featured)}
                            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer ${form.featured
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                                }`}
                        >
                            <span className={`h-2 w-2 rounded-full ${form.featured ? 'bg-amber-500' : 'bg-outline'}`} />
                            {form.featured ? 'Featured' : 'Not featured'}
                        </button>
                    </FormField>

                    {/* Waypoints */}
                    <FormField label="Waypoints">
                        <DynamicList
                            items={waypoints}
                            label="Waypoint"
                            fields={[
                                { key: 'name', label: 'Name', placeholder: 'e.g. Camp 1' },
                                { key: 'description', label: 'Description', placeholder: 'e.g. First rest area' },
                                { key: 'icon', label: 'Icon', type: 'select', options: WAYPOINT_ICON_OPTIONS },
                            ]}
                            onAdd={() => setWaypoints([...waypoints, { ...DEFAULT_WAYPOINT }])}
                            onRemove={(idx) => setWaypoints(waypoints.filter((_, i) => i !== idx))}
                            onUpdate={(idx, key, value) => {
                                const updated = [...waypoints];
                                updated[idx] = { ...updated[idx], [key]: value };
                                setWaypoints(updated);
                            }}
                        />
                    </FormField>

                    {/* Elevation Points */}
                    <FormField label="Elevation Points">
                        <DynamicList
                            items={elevationPoints}
                            label="Point"
                            fields={[
                                { key: 'label', label: 'Label', placeholder: 'e.g. Base Camp' },
                                { key: 'elevation', label: 'Elevation', placeholder: 'e.g. 580m' },
                            ]}
                            onAdd={() => setElevationPoints([...elevationPoints, { ...DEFAULT_ELEVATION }])}
                            onRemove={(idx) => setElevationPoints(elevationPoints.filter((_, i) => i !== idx))}
                            onUpdate={(idx, key, value) => {
                                const updated = [...elevationPoints];
                                updated[idx] = { ...updated[idx], [key]: value };
                                setElevationPoints(updated);
                            }}
                        />
                    </FormField>

                    {/* Paragraphs */}
                    <FormField label="Detailed Description">
                        <ParagraphList
                            paragraphs={paragraphs}
                            onChange={setParagraphs}
                        />
                    </FormField>

                    {/* Highlights */}
                    <FormField label="Highlights">
                        <DynamicList
                            items={highlights}
                            label="Highlight"
                            fields={[
                                { key: 'id', label: 'ID', placeholder: 'e.g. flora-fauna' },
                                { key: 'label', label: 'Label', placeholder: 'e.g. Flora & Fauna:' },
                                { key: 'description', label: 'Description', placeholder: 'Describe the highlight...' },
                            ]}
                            onAdd={() => setHighlights([...highlights, { ...DEFAULT_HIGHLIGHT }])}
                            onRemove={(idx) => setHighlights(highlights.filter((_, i) => i !== idx))}
                            onUpdate={(idx, key, value) => {
                                const updated = [...highlights];
                                updated[idx] = { ...updated[idx], [key]: value };
                                setHighlights(updated);
                            }}
                        />
                    </FormField>

                    {/* Gallery */}
                    <FormField label="Trail Gallery">
                        <GalleryDropZone
                            images={galleryImages}
                            onAdd={handleGalleryImageAdd}
                            onRemove={(idx) => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                        />
                    </FormField>

                    {/* Reviews - Picker */}
                    <FormField label={`Reviews (${selectedReviews.length} selected)`}>
                        <ReviewPicker
                            selectedReviews={selectedReviews}
                            onToggle={toggleReview}
                        />
                    </FormField>
                </div>

                {/* Footer */}
                <div className="border-t border-outline-variant/20 px-5 py-4 flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={requestClose}>
                        Cancel
                    </Button>
                    <Button variant="default" className="flex-1 gap-2" onClick={handleSave}>
                        <Save className="h-4 w-4" />
                        Save Trail
                    </Button>
                </div>
            </aside>
        </div>
    );
}
