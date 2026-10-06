import { useSyncExternalStore } from 'react';
import { MOCK_TRANSACTIONS, MOCK_USERS } from '../mockData';

const STORAGE_KEY = 'masaraga_hiker_store_v1';
const HIKER = MOCK_USERS.find((user) => user.role === 3) || {};

function createSeed() {
    return {
        profile: {
            name: HIKER.name || '',
            email: HIKER.email || '',
            mobile: '',
            emergencyContact: {
                name: '',
                relation: '',
                mobile: '',
            },
        },
        transactions: MOCK_TRANSACTIONS,
    };
}

function load() {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && Array.isArray(parsed.transactions)) {
                return parsed;
            }
        }
    } catch (error) {
        // Fall through to seed data when storage is unavailable.
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

function formatPeso(amount) {
    return `₱${Number(amount).toFixed(2)}`;
}

// A guest booking has no account behind it, so the confirmation screen hands the
// booking straight to the hiker store. That keeps the hiker's own dashboard,
// transactions list, and passes populated without a login step.
export function addHikerBooking({ trail, hikeDate, dateBooked, passes, hikers = [], totalAmount, paymentMethod, breakdown }) {
    const referenceNo = `Ref: MSG${Math.floor(10000000 + Math.random() * 90000000)}`;

    const transaction = {
        transactionId: `TXN-${Date.now().toString().slice(-6)}`,
        dateBooked,
        hikeDate,
        trail,
        participantCount: passes.length,
        status: 'Confirmed',
        totalPaid: formatPeso(totalAmount),
        paymentMethod,
        referenceNo,
        passesData: passes,
        // Kept alongside the passes so the health declaration and waiver can be
        // reproduced later from the transaction, not only on the booking screen.
        hikers: hikers.map((hiker) => ({ ...hiker })),
        receiptData: {
            breakdown: breakdown.map((line) => ({ label: line.label, amount: formatPeso(line.amount) })),
            totalPaid: formatPeso(totalAmount),
            paymentMethod: `Paid via ${paymentMethod}`,
            referenceNo,
        },
    };

    setState((current) => ({
        ...current,
        transactions: [transaction, ...current.transactions],
    }));

    return transaction;
}

export function cancelBooking(transactionId, reason) {
    setState((current) => ({
        ...current,
        transactions: current.transactions.map((txn) =>
            txn.transactionId === transactionId
                ? {
                       ...txn,
                       status: 'Cancelled',
                       cancellationReason: reason || null,
                       passesData: txn.passesData.map((pass) => ({ ...pass, status: 'Cancelled' })),
                   }
                : txn
        ),
    }));
}

export function updateProfile(profile) {
    setState((current) => ({ ...current, profile: { ...current.profile, ...profile } }));
}

export function useHikerStore() {
    return useSyncExternalStore(subscribe, getState);
}
