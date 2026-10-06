import { useSyncExternalStore } from 'react';
import { ADMIN_BOOKINGS, ADMIN_DAILY_QUOTA, ADMIN_SCHEDULES, ADMIN_USERS, TRAILS, ADMIN_GUIDES, ADMIN_SETTINGS, ADMIN_ANNOUNCEMENTS } from '../mockData';

// Bumped to v3 because seeded schedules and bookings now generate their dates
// from the current month; older sessions cached schedule ids that no longer exist.
const STORAGE_KEY = 'masaraga_admin_store_v3';
const ADMIN = ADMIN_USERS.find((user) => user.role === 1) || ADMIN_USERS[0] || {};

const TRAILS_ARRAY = Object.entries(TRAILS).map(([id, trail]) => ({
    ...trail,
    id,
    status: 'Active',
    featured: id === 'amtic',
}));

function cloneSettings(settings) {
    return JSON.parse(JSON.stringify(settings));
}

function mergeSettings(defaults, current) {
    if (!current || typeof current !== 'object' || Array.isArray(current)) {
        return cloneSettings(defaults);
    }

    return Object.entries(defaults).reduce((merged, [key, value]) => {
        const currentValue = current[key];
        const nextValue = value && typeof value === 'object' && !Array.isArray(value)
            ? mergeSettings(value, currentValue)
            : currentValue ?? value;
        merged[key] = nextValue;
        return merged;
    }, {});
}

function createSeed() {
    return {
        profile: {
            name: ADMIN.name || '',
            email: ADMIN.email || '',
            role: ADMIN.role ?? 1,
            subtitle: ADMIN.subtitle || '',
        },
        bookings: ADMIN_BOOKINGS,
        quota: ADMIN_DAILY_QUOTA,
        schedules: ADMIN_SCHEDULES,
        users: ADMIN_USERS,
        trails: TRAILS_ARRAY,
        guides: ADMIN_GUIDES,
        settings: cloneSettings(ADMIN_SETTINGS),
        auditLog: [],
        announcements: ADMIN_ANNOUNCEMENTS,
    };
}

function load() {
    const seed = createSeed();

    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && Array.isArray(parsed.bookings)) {
                return {
                    ...parsed,
                    settings: mergeSettings(seed.settings, parsed.settings),
                    auditLog: Array.isArray(parsed.auditLog) ? parsed.auditLog : [],
                };
            }
        }
    } catch (error) {
        // Fall through to seed data when storage is unavailable.
    }
    return seed;
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

// The reference is the passenger-facing PNR: it is generated once by the booking
// flow, shown on the confirmation, and required by the public booking lookup.
export function createBookingReference() {
    return `TXN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;
}

export function createBooking(booking) {
    setState((current) => ({
        ...current,
        bookings: [
            {
                ...booking,
                id: booking.id ?? `BK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`,
                reference: booking.reference ?? createBookingReference(),
                contactEmail: booking.contactEmail ?? booking.hikers?.[0]?.email ?? '',
                hikers: booking.hikers ?? [],
                status: booking.status ?? 'Pending',
            },
            ...current.bookings,
        ],
    }));
}

export function updateBookingStatus(bookingId, status) {
    setState((current) => ({
        ...current,
        bookings: current.bookings.map((booking) =>
            booking.id === bookingId ? { ...booking, status } : booking
        ),
    }));
}

export function cancelBooking(bookingId) {
    updateBookingStatus(bookingId, 'Cancelled');
}

export function rescheduleBooking(bookingId, date) {
    setState((current) => ({
        ...current,
        bookings: current.bookings.map((booking) =>
            booking.id === bookingId ? { ...booking, date } : booking
        ),
    }));
}

export function refundBooking(bookingId) {
    updateBookingStatus(bookingId, 'Refunded');
}

export function createSchedule(schedule) {
    setState((current) => ({
        ...current,
        schedules: [
            ...current.schedules,
            { booked: 0, status: 'Available', ...schedule },
        ],
    }));
}

export function rescheduleSchedule(scheduleId, dateKey, date) {
    setState((current) => ({
        ...current,
        schedules: current.schedules.map((schedule) =>
            schedule.id === scheduleId ? { ...schedule, dateKey, date } : schedule
        ),
    }));
}

export function changeScheduleGuide(scheduleId, guide) {
    setState((current) => ({
        ...current,
        schedules: current.schedules.map((schedule) =>
            schedule.id === scheduleId ? { ...schedule, guide } : schedule
        ),
    }));
}

export function createTrail(trail) {
    setState((current) => ({
        ...current,
        trails: [
            {
                ...trail,
                id: trail.id || `trail-${Date.now()}`,
                status: trail.status || 'Draft',
                featured: trail.featured || false,
            },
            ...current.trails,
        ],
    }));
}

export function updateTrail(trailId, updates) {
    setState((current) => ({
        ...current,
        trails: current.trails.map((trail) =>
            trail.id === trailId ? { ...trail, ...updates } : trail
        ),
    }));
}

export function deleteTrail(trailId) {
    setState((current) => ({
        ...current,
        trails: current.trails.filter((trail) => trail.id !== trailId),
    }));
}

export function toggleTrailFeatured(trailId) {
    setState((current) => ({
        ...current,
        trails: current.trails.map((trail) =>
            trail.id === trailId ? { ...trail, featured: !trail.featured } : trail
        ),
    }));
}

export function createGuide(guide) {
    setState((current) => ({
        ...current,
        guides: [
            {
                ...guide,
                id: guide.id || `guide-${Date.now()}`,
                status: guide.status || 'Active',
                totalClimbs: guide.totalClimbs || 0,
                rating: guide.rating || 0,
            },
            ...current.guides,
        ],
    }));
}

export function updateGuide(guideId, updates) {
    setState((current) => ({
        ...current,
        guides: current.guides.map((guide) =>
            guide.id === guideId ? { ...guide, ...updates } : guide
        ),
    }));
}

export function deleteGuide(guideId) {
    setState((current) => ({
        ...current,
        guides: current.guides.filter((guide) => guide.id !== guideId),
    }));
}

export function createAnnouncement(announcement) {
    setState((current) => ({
        ...current,
        announcements: [
            {
                ...announcement,
                id: announcement.id ?? `ANN-${Date.now()}`,
                createdAt: announcement.createdAt ?? new Date().toISOString(),
            },
            ...current.announcements,
        ],
    }));
}

export function updateAnnouncement(announcementId, updates) {
    setState((current) => ({
        ...current,
        announcements: current.announcements.map((announcement) =>
            announcement.id === announcementId ? { ...announcement, ...updates } : announcement
        ),
    }));
}

export function deleteAnnouncement(announcementId) {
    setState((current) => ({
        ...current,
        announcements: current.announcements.filter((announcement) => announcement.id !== announcementId),
    }));
}

export function sendAnnouncement(announcementId) {
    setState((current) => ({
        ...current,
        announcements: current.announcements.map((announcement) =>
            announcement.id === announcementId
                ? { ...announcement, status: 'sent', sentAt: new Date().toISOString() }
                : announcement
        ),
    }));
}

export function createUser(user) {
    setState((current) => ({
        ...current,
        users: [
            {
                ...user,
                id: user.id ?? `user_${Date.now()}`,
                status: user.status || 'Active',
            },
            ...current.users,
        ],
    }));
}

export function updateUser(userId, updates) {
    setState((current) => ({
        ...current,
        users: current.users.map((u) =>
            u.id === userId ? { ...u, ...updates } : u
        ),
    }));
}

export function deleteUser(userId) {
    setState((current) => ({
        ...current,
        users: current.users.filter((u) => u.id !== userId),
    }));
}

function getChangedFields(previous, updates) {
    return Object.keys(updates).filter((key) => JSON.stringify(previous?.[key]) !== JSON.stringify(updates[key]));
}

function addAuditEntry(current, section, changedFields, actor) {
    return [
        {
            id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            section,
            changedFields,
            actor: actor || 'Admin',
            createdAt: new Date().toISOString(),
        },
        ...(current.auditLog || []),
    ].slice(0, 25);
}

export function updateSettings(group, updates, actor = 'Admin') {
    setState((current) => {
        const previous = current.settings?.[group] || {};
        const changedFields = getChangedFields(previous, updates);
        if (changedFields.length === 0) {
            return current;
        }

        return {
            ...current,
            settings: {
                ...current.settings,
                [group]: { ...previous, ...updates },
            },
            auditLog: addAuditEntry(current, group, changedFields, actor),
        };
    });
}

export function updateSettingItem(group, itemKey, updates, actor = 'Admin') {
    setState((current) => {
        const groupSettings = current.settings?.[group] || {};
        const previous = groupSettings[itemKey] || {};
        const changedFields = getChangedFields(previous, updates);
        if (changedFields.length === 0) {
            return current;
        }

        return {
            ...current,
            settings: {
                ...current.settings,
                [group]: {
                    ...groupSettings,
                    [itemKey]: { ...previous, ...updates },
                },
            },
            auditLog: addAuditEntry(current, `${group}.${itemKey}`, changedFields, actor),
        };
    });
}

export function resetSettings(actor = 'Admin') {
    setState((current) => {
        const changedFields = Object.keys(ADMIN_SETTINGS).filter(
            (key) => JSON.stringify(current.settings?.[key]) !== JSON.stringify(ADMIN_SETTINGS[key])
        );
        if (changedFields.length === 0) {
            return current;
        }

        return {
            ...current,
            settings: cloneSettings(ADMIN_SETTINGS),
            auditLog: addAuditEntry(current, 'settings', changedFields, actor),
        };
    });
}

export function useAdminStore() {
    return useSyncExternalStore(subscribe, getState);
}