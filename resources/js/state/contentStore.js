import { useSyncExternalStore } from 'react';
import { NEWS, AWARDS, GALLERY_ITEMS, ABOUT_ZONES, ABOUT_RESOURCES, FAQ_CATEGORIES } from '../mockData';

const STORAGE_KEY = 'masaraga_content_store_v1';

function createSeed() {
    return {
        news: NEWS.map((item) => ({ ...item })),
        awards: AWARDS.map((item) => ({ ...item })),
        gallery: GALLERY_ITEMS.map((item) => ({ ...item })),
        about: {
            hero: {
                title: 'Discover Mt. Masaraga',
                subtitle: 'Rising majestically in the Bicol region, Mt. Masaraga is a forested stratovolcano standing at 1,328 meters above sea level. Characterized by dense, lush mountain moss forests and rugged terrain, it offers a challenging yet deeply rewarding experience for ecotourism and conservation advocates.',
                description: 'Under the stewardship of the Protected Area Management Board (PAMB) and the Department of Environment and Natural Resources (DENR), active bio-monitoring preserves its endemic flora and fauna, making it an extraordinary living laboratory for environmental research.',
            },
            stats: [
                { id: 'elevation', icon: 'MoveVertical', value: '1,328m', label: 'Summit Crest', badge: 'ASL' },
                { id: 'flora', icon: 'Trees', value: 'Moss Forest', label: 'Cloud Canopy', badge: 'Flora' },
                { id: 'river', icon: 'Droplets', value: 'Watershed', label: 'Perennial Stream', badge: 'River' },
                { id: 'pamb', icon: 'BadgeCheck', value: 'DENR Stewarded', label: 'Protected Area', badge: 'PAMB' },
            ],
            zones: ABOUT_ZONES.map((z) => ({ ...z })),
            resources: ABOUT_RESOURCES.map((r) => ({ ...r })),
        },
        faq: FAQ_CATEGORIES.map((cat) => ({
            ...cat,
            id: cat.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            icon: undefined,
            iconKey: cat.icon?.displayName || 'HelpCircle',
        })),
    };
}

function load() {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && Array.isArray(parsed.news)) {
                return parsed;
            }
        }
    } catch (error) {
        // Fall through to seed data.
    }
    return createSeed();
}

let state = load();

const listeners = new Set();

function persist() {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        // Keep in-memory state even when storage is unavailable.
    }
}

function setState(updater) {
    state = updater(state);
    persist();
    listeners.forEach((listener) => listener());
}

function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getState() {
    return state;
}

function generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

// ── News ──────────────────────────────────────────────────────────────
export function addNews(item) {
    setState((current) => ({
        ...current,
        news: [{ ...item, id: item.id || generateId('news') }, ...current.news],
    }));
}

export function updateNews(id, updates) {
    setState((current) => ({
        ...current,
        news: current.news.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
}

export function deleteNews(id) {
    setState((current) => ({
        ...current,
        news: current.news.filter((item) => item.id !== id),
    }));
}

// ── Awards ────────────────────────────────────────────────────────────
export function addAward(item) {
    setState((current) => ({
        ...current,
        awards: [{ ...item, id: item.id || generateId('award') }, ...current.awards],
    }));
}

export function updateAward(id, updates) {
    setState((current) => ({
        ...current,
        awards: current.awards.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
}

export function deleteAward(id) {
    setState((current) => ({
        ...current,
        awards: current.awards.filter((item) => item.id !== id),
    }));
}

// ── Gallery ───────────────────────────────────────────────────────────
export function addGalleryItem(item) {
    setState((current) => ({
        ...current,
        gallery: [{ ...item, id: item.id || generateId('gallery') }, ...current.gallery],
    }));
}

export function updateGalleryItem(id, updates) {
    setState((current) => ({
        ...current,
        gallery: current.gallery.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
}

export function deleteGalleryItem(id) {
    setState((current) => ({
        ...current,
        gallery: current.gallery.filter((item) => item.id !== id),
    }));
}

// ── About ─────────────────────────────────────────────────────────────
export function updateAboutHero(updates) {
    setState((current) => ({
        ...current,
        about: { ...current.about, hero: { ...current.about.hero, ...updates } },
    }));
}

export function updateAboutStats(stats) {
    setState((current) => ({
        ...current,
        about: { ...current.about, stats },
    }));
}

export function addAboutZone(zone) {
    setState((current) => ({
        ...current,
        about: {
            ...current.about,
            zones: [{ ...zone, id: zone.id || generateId('zone') }, ...current.about.zones],
        },
    }));
}

export function updateAboutZone(id, updates) {
    setState((current) => ({
        ...current,
        about: {
            ...current.about,
            zones: current.about.zones.map((z) => (z.id === id ? { ...z, ...updates } : z)),
        },
    }));
}

export function deleteAboutZone(id) {
    setState((current) => ({
        ...current,
        about: {
            ...current.about,
            zones: current.about.zones.filter((z) => z.id !== id),
        },
    }));
}

export function addAboutResource(resource) {
    setState((current) => ({
        ...current,
        about: {
            ...current.about,
            resources: [{ ...resource, id: resource.id || generateId('resource') }, ...current.about.resources],
        },
    }));
}

export function updateAboutResource(id, updates) {
    setState((current) => ({
        ...current,
        about: {
            ...current.about,
            resources: current.about.resources.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        },
    }));
}

export function deleteAboutResource(id) {
    setState((current) => ({
        ...current,
        about: {
            ...current.about,
            resources: current.about.resources.filter((r) => r.id !== id),
        },
    }));
}

// ── FAQ ───────────────────────────────────────────────────────────────
export function addFaqCategory(category) {
    setState((current) => ({
        ...current,
        faq: [{ ...category, id: category.id || generateId('faq') }, ...current.faq],
    }));
}

export function updateFaqCategory(id, updates) {
    setState((current) => ({
        ...current,
        faq: current.faq.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat)),
    }));
}

export function deleteFaqCategory(id) {
    setState((current) => ({
        ...current,
        faq: current.faq.filter((cat) => cat.id !== id),
    }));
}

// ── Hook ──────────────────────────────────────────────────────────────
export function useContentStore() {
    return useSyncExternalStore(subscribe, getState);
}
