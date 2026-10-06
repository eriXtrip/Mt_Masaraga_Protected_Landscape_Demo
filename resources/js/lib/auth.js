const SESSION_STORE_KEYS = [
    'masaraga_admin_store_v2',
    'masaraga_staff_store_v1',
    'masaraga_hiker_store_v1',
    'masaraga_content_store',
];

export function signOutCurrentUser({ redirectTo = '/' } = {}) {
    try {
        window.localStorage.removeItem('currentUser');
        SESSION_STORE_KEYS.forEach((key) => window.sessionStorage.removeItem(key));
    } catch {
        // Storage can be unavailable in private modes; the redirect still has to happen.
    }

    window.location.assign(redirectTo);
}
