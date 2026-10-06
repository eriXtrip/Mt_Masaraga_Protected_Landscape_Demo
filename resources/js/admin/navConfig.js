// resources/js/admin/navConfig.js
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    Wallet,
    Mountain,
    UserCheck,
    Newspaper,
    Megaphone,
    BarChart3,
    Settings,
} from 'lucide-react';

export const ADMIN_NAV_GROUPS = [
    {
        label: 'Overview',
        items: [
            { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        ],
    },
    {
        label: 'Operations',
        items: [
            { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
            { to: '/admin/payments', label: 'Payments', icon: Wallet },
            { to: '/admin/trails', label: 'Trails', icon: Mountain },
            { to: '/admin/guides', label: 'Guides', icon: UserCheck },
        ],
    },
    {
        label: 'Content & Comms',
        items: [
            { to: '/admin/content', label: 'Content', icon: Newspaper },
            { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
        ],
    },
    {
        label: 'Insights',
        items: [
            { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
        ],
    },
    {
        label: 'System',
        items: [
            { to: '/admin/users', label: 'Users', icon: Users },
            { to: '/admin/settings', label: 'Settings', icon: Settings },
        ],
    },
];

export const ADMIN_SECTIONS = {
    '/admin/dashboard': {
        title: 'Dashboard',
        description: 'Overview of bookings, revenue, daily quota usage, trail status, and user counts.',
    },
    '/admin/users': {
        title: 'Users',
        description: 'Manage hiker and staff accounts, roles, and activation.',
    },
    '/admin/bookings': {
        title: 'Bookings',
        description: 'Approve, cancel, reschedule, and refund permits across all trails.',
    },
    '/admin/payments': {
        title: 'Payments',
        description: 'Track GCash, Maya, card, and bank payments, reference numbers, and refunds.',
    },
    '/admin/trails': {
        title: 'Trails',
        description: 'Manage schedules, daily slot allocations, and quota usage.',
    },
    '/admin/guides': {
        title: 'Guides',
        description: 'Accredited guide registry and hike assignments.',
    },
    '/admin/content': {
        title: 'Content',
        description: 'Create and edit news, advisories, awards, and gallery entries.',
    },
    '/admin/announcements': {
        title: 'Announcements',
        description: 'Broadcast official announcements to hikers and park staff.',
    },
    '/admin/reports': {
        title: 'Reports',
        description: 'Revenue breakdown by fee type and trail fill rates.',
    },
    '/admin/settings': {
        title: 'Settings',
        description: 'Manage fees, capacity defaults, legal and utility pages, contacts, and the settings audit trail.',
    },
};