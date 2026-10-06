import { useSyncExternalStore } from 'react';
import QRCode from '../../../public/images/QR_Code_Example.svg.webp';
import {
    ADMIN_ANNOUNCEMENTS,
    ADMIN_BOOKINGS,
    ADMIN_OPERATIONAL_DATE,
    ADMIN_SCHEDULES,
    CHECKLIST_ITEMS,
    MOCK_TRANSACTIONS,
    MOCK_USERS,
} from '../mockData';
import { updateBookingStatus, useAdminStore } from './adminStore';

const STORAGE_KEY = 'masaraga_staff_store_v1';
const FALLBACK_STAFF = MOCK_USERS.find((user) => user.role === 2) || MOCK_USERS[0];

// The console follows the park's headline climb day, not the last schedule in the
// list: schedules extend into next month, and the roster here belongs to today.
export const STAFF_OPERATIONAL_DATE = ADMIN_OPERATIONAL_DATE;

const normalizeName = (value = '') => value.toLowerCase().replace(/[^a-z]/g, '');

const getInitials = (name = '') => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'ST';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const getLocalStaff = () => {
    if (typeof window === 'undefined') return FALLBACK_STAFF;

    try {
        const stored = window.localStorage.getItem('currentUser');
        const parsed = stored ? JSON.parse(stored) : null;
        return parsed?.role === 2 ? parsed : FALLBACK_STAFF;
    } catch (error) {
        return FALLBACK_STAFF;
    }
};

export function getStaffUser() {
    return getLocalStaff();
}

export function getStaffGuide(staff = getStaffUser(), guides = []) {
    return guides.find((guide) => normalizeName(guide.name) === normalizeName(staff.name)) || null;
}

export function isScheduleAssigned(schedule, staff = getStaffUser(), guides = []) {
    if (!schedule || !staff) return false;

    const guide = getStaffGuide(staff, guides);
    if (guide?.assignedTrails?.includes(schedule.trailId)) return true;

    const scheduleGuide = normalizeName(schedule.guide);
    const staffName = normalizeName(staff.name);
    const staffParts = staff.name.trim().split(/\s+/).filter(Boolean);
    const abbreviatedStaffName = staffParts.length > 1
        ? normalizeName(`${staffParts[0][0]}${staffParts.at(-1)}`)
        : staffName;
    return scheduleGuide === staffName || scheduleGuide === abbreviatedStaffName;
}

export function getAssignedSchedules(schedules = [], staff = getStaffUser(), guides = []) {
    return schedules.filter((schedule) => isScheduleAssigned(schedule, staff, guides));
}

export function getAssignedBookings(bookings = [], schedules = [], staff = getStaffUser(), guides = []) {
    const assignedIds = new Set(getAssignedSchedules(schedules, staff, guides).map((schedule) => schedule.id));
    return bookings.filter((booking) => assignedIds.has(booking.scheduleId));
}

export function getBookingDocuments(booking, documentStatuses = {}) {
    const saved = documentStatuses[booking.id] || {};
    return (booking.documents || CHECKLIST_ITEMS.map((item) => ({ id: item.id, title: item.title }))).map((document) => ({
        ...document,
        status: saved[document.id]?.status || document.status || 'Needs follow-up',
    }));
}

export function getBookingPasses(bookings = []) {
    const transactionsByReference = new Map(MOCK_TRANSACTIONS.map((transaction) => [transaction.transactionId, transaction]));

    return bookings.flatMap((booking) => {
        const transaction = transactionsByReference.get(booking.reference);
        const assignedLeadHiker = booking.hikers?.[0]?.fullName || booking.leadHiker;
        const sourcePasses = transaction?.passesData?.length
            ? transaction.passesData
            : (booking.hikers || [{ fullName: booking.leadHiker }]).map((hiker) => ({ hikerName: hiker.fullName }));

        return sourcePasses.map((pass, index) => ({
            id: pass.id || `MMPL-${booking.id}-${index + 1}`,
            bookingId: booking.id,
            scheduleId: booking.scheduleId,
            reference: booking.reference,
            hikerName: booking.hikers?.[index]?.fullName || pass.hikerName || booking.leadHiker,
            leadHiker: assignedLeadHiker || pass.leadHiker || pass.hikerName,
            trail: pass.trail || booking.trail,
            date: pass.date || booking.date,
            qrCodeUrl: pass.qrCodeUrl || QRCode,
            seededStatus: pass.status || 'Valid',
        }));
    });
}

function createDocumentStatuses(bookings = []) {
    return bookings.reduce((statuses, booking) => {
        statuses[booking.id] = (booking.documents || CHECKLIST_ITEMS).reduce((bookingStatuses, document) => {
            bookingStatuses[document.id] = { status: document.status || 'Needs follow-up' };
            return bookingStatuses;
        }, {});
        return statuses;
    }, {});
}

function createChannels() {
    const channels = {};

    const announcements = ADMIN_ANNOUNCEMENTS
        .filter((announcement) => announcement.audience === 'all' || announcement.audience === 'staff')
        .slice(0, 3)
        .map((announcement, index) => ({
            id: `announcement-${announcement.id}`,
            sender: announcement.author || 'Park office',
            avatar: getInitials(announcement.author || 'Park Office'),
            message: announcement.content,
            timestamp: announcement.sentAt || announcement.createdAt || '09:30 AM',
            isAdmin: true,
            isSelf: false,
            announcementId: announcement.id,
            sequence: index,
        }));

    if (announcements.length > 0) {
        channels['park-announcements'] = {
            id: 'park-announcements',
            type: 'admin',
            title: 'Park announcements',
            subtitle: 'Updates for staff and assigned groups',
            lastMessage: announcements.at(-1)?.message || 'No new announcements',
            timestamp: '09:30 AM',
            unreadCount: 0,
            messages: announcements,
            members: [],
        };
    }

    return channels;
}

function createSeedState() {
    const bookings = ADMIN_BOOKINGS;
    const passes = getBookingPasses(bookings);
    const dateKeyByScheduleId = new Map(ADMIN_SCHEDULES.map((schedule) => [schedule.id, schedule.dateKey]));
    const checkIns = passes.reduce((records, pass) => {
        if (pass.seededStatus === 'Used') {
            const hikeDate = dateKeyByScheduleId.get(pass.scheduleId) || STAFF_OPERATIONAL_DATE;
            records[pass.id] = {
                passId: pass.id,
                checkedInAt: `${hikeDate}T08:32:00.000Z`,
                checkedInBy: FALLBACK_STAFF.name,
                location: 'Jump-off',
            };
        }
        return records;
    }, {});

    return {
        checkIns,
        documentStatuses: createDocumentStatuses(bookings),
        channels: createChannels(),
        trailLogs: [],
        incidents: [],
    };
}

function loadState() {
    const seed = createSeedState();

    if (typeof window === 'undefined') return seed;

    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return seed;
        const parsed = JSON.parse(raw);
        return {
            ...seed,
            ...parsed,
            checkIns: parsed.checkIns && typeof parsed.checkIns === 'object' ? parsed.checkIns : seed.checkIns,
            documentStatuses: parsed.documentStatuses && typeof parsed.documentStatuses === 'object' ? parsed.documentStatuses : seed.documentStatuses,
            channels: parsed.channels && typeof parsed.channels === 'object' ? parsed.channels : seed.channels,
            trailLogs: Array.isArray(parsed.trailLogs) ? parsed.trailLogs : [],
            incidents: Array.isArray(parsed.incidents) ? parsed.incidents : [],
        };
    } catch (error) {
        return seed;
    }
}

let state = loadState();
const listeners = new Set();

function getState() {
    return state;
}

function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function persist() {
    try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        return undefined;
    }
    return undefined;
}

function setState(updater) {
    state = updater(state);
    persist();
    listeners.forEach((listener) => listener());
}

export function updateDocumentStatus(bookingId, documentId, status) {
    setState((current) => ({
        ...current,
        documentStatuses: {
            ...current.documentStatuses,
            [bookingId]: {
                ...(current.documentStatuses[bookingId] || {}),
                [documentId]: { status },
            },
        },
    }));
}

export function checkInPass(passId, location = 'Jump-off') {
    setState((current) => ({
        ...current,
        checkIns: {
            ...current.checkIns,
            [passId]: {
                passId,
                checkedInAt: new Date().toISOString(),
                checkedInBy: getStaffUser().name,
                location,
            },
        },
    }));
}

export function undoCheckIn(passId) {
    setState((current) => {
        const nextCheckIns = { ...current.checkIns };
        delete nextCheckIns[passId];
        return { ...current, checkIns: nextCheckIns };
    });
}

export function markChannelRead(channelId) {
    setState((current) => {
        const channel = current.channels[channelId];
        if (!channel || channel.unreadCount === 0) return current;
        return {
            ...current,
            channels: {
                ...current.channels,
                [channelId]: { ...channel, unreadCount: 0 },
            },
        };
    });
}

export function sendMessage(channelId, message) {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return false;

    setState((current) => {
        const channel = current.channels[channelId];
        if (!channel) return current;

        const now = new Date();
        const timestamp = now.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' });
        const nextMessage = {
            id: `${channelId}-${now.getTime()}`,
            sender: getStaffUser().name,
            avatar: getInitials(getStaffUser().name),
            message: trimmedMessage,
            timestamp,
            isAdmin: true,
            isSelf: true,
        };

        return {
            ...current,
            channels: {
                ...current.channels,
                [channelId]: {
                    ...channel,
                    lastMessage: trimmedMessage,
                    timestamp,
                    unreadCount: 0,
                    messages: [...channel.messages, nextMessage],
                },
            },
        };
    });

    return true;
}

export function addTrailLog(log) {
    setState((current) => ({
        ...current,
        trailLogs: [
            {
                id: `LOG-${Date.now()}`,
                date: STAFF_OPERATIONAL_DATE,
                createdAt: new Date().toISOString(),
                createdBy: getStaffUser().name,
                ...log,
            },
            ...current.trailLogs,
        ],
    }));
}

export function addIncident(incident) {
    setState((current) => ({
        ...current,
        incidents: [
            {
                id: `INC-${Date.now()}`,
                date: STAFF_OPERATIONAL_DATE,
                createdAt: new Date().toISOString(),
                createdBy: getStaffUser().name,
                status: 'Open',
                ...incident,
            },
            ...current.incidents,
        ],
    }));
}

export function useStaffStore() {
    const adminState = useAdminStore();
    const operationalState = useSyncExternalStore(subscribe, getState, getState);
    const staff = getStaffUser();
    const assignedSchedules = getAssignedSchedules(adminState.schedules, staff, adminState.guides);
    const assignedScheduleIds = new Set(assignedSchedules.map((schedule) => schedule.id));
    const assignedBookings = adminState.bookings.filter((booking) => assignedScheduleIds.has(booking.scheduleId));
    const passes = getBookingPasses(assignedBookings);

    return {
        ...adminState,
        ...operationalState,
        staff,
        operationalDate: STAFF_OPERATIONAL_DATE,
        assignedSchedules,
        assignedBookings,
        passes,
    };
}

export function setBookingStatus(bookingId, status) {
    updateBookingStatus(bookingId, status);
}
