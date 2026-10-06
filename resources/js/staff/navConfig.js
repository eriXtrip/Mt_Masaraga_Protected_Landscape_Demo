import {
    CalendarDays,
    ClipboardCheck,
    ClipboardList,
    LayoutDashboard,
    MessageSquare,
    ScanLine,
    UsersRound,
} from 'lucide-react';

export const STAFF_NAV_GROUPS = [
    {
        label: 'Today',
        items: [
            { to: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        ],
    },
    {
        label: 'Field operations',
        items: [
            { to: '/staff/schedules', label: 'My schedules', icon: CalendarDays },
            { to: '/staff/verify', label: 'Pass verification', icon: ScanLine },
            { to: '/staff/bookings', label: 'Permit bookings', icon: ClipboardCheck },
        ],
    },
    {
        label: 'Group coordination',
        items: [
            { to: '/staff/messages', label: 'Messages', icon: MessageSquare },
            { to: '/staff/reports', label: 'Field reports', icon: ClipboardList },
        ],
    },
];

export const STAFF_SECTIONS = {
    '/staff/dashboard': {
        title: 'Dashboard',
        description: 'Your assigned climbs, check-in progress, and operational alerts for the next field day.',
    },
    '/staff/schedules': {
        title: 'My schedules',
        description: 'Review assigned trails, dates, capacity, and the groups you are guiding.',
    },
    '/staff/verify': {
        title: 'Pass verification',
        description: 'Check digital passes and physical documents at the jump-off point.',
    },
    '/staff/bookings': {
        title: 'Permit bookings',
        description: 'Review permit applications and confirm the groups assigned to your duty.',
    },
    '/staff/groups/:id': {
        title: 'Group roster',
        description: 'Review the hikers, emergency details, and check-in state for an assigned group.',
    },
    '/staff/messages': {
        title: 'Messages',
        description: 'Coordinate with assigned groups and keep park announcements in one place.',
    },
    '/staff/reports': {
        title: 'Field reports',
        description: 'Record trail logs, incidents, and summit check-ins from your duty.',
    },
};

export const STAFF_SECTION_FALLBACK = {
    title: 'Park staff',
    description: 'Field operations for Mt. Masaraga Protected Landscape.',
};

export const STAFF_GROUPS_ICON = UsersRound;
