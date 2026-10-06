import { Newspaper, Award, Image } from 'lucide-react';

const CATEGORY_CONFIG = {
    Advisory: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    Weather: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    Update: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    News: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
};

export function getCategoryBadge(category) {
    return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.News;
}

export const NEWS_CATEGORIES = ['Advisory', 'Weather', 'Update', 'News'];

export const CONTENT_TABS = [
    { key: 'news', label: 'News & Advisories', icon: Newspaper },
    { key: 'awards', label: 'Awards', icon: Award },
    { key: 'gallery', label: 'Gallery', icon: Image },
];
