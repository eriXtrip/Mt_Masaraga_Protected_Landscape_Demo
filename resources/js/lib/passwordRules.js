// One source of truth for password policy: the public signup wizard, the reset
// flow, and the admin console user form all validate against these rules.
export const PASSWORD_RULES = [
    { label: 'uppercase letter', test: /[A-Z]/ },
    { label: 'lowercase letter', test: /[a-z]/ },
    { label: 'number', test: /[0-9]/ },
    { label: 'special character', test: /[^A-Za-z0-9]/ },
];

export const MIN_PASSWORD_LENGTH = 8;

// How many of the character rules the password satisfies, for the strength meter.
export function getPasswordStrength(password = '') {
    return PASSWORD_RULES.filter((rule) => rule.test.test(password)).length;
}

export function getMissingPasswordRules(password = '') {
    if (!password) {
        return PASSWORD_RULES.map((rule) => rule.label);
    }

    return PASSWORD_RULES.filter((rule) => !rule.test.test(password)).map((rule) => rule.label);
}

// Adds the length rule on top of the character rules, for callers that enforce it.
export function getPasswordRequirements(password = '') {
    const missing = [];

    if (password.length < MIN_PASSWORD_LENGTH) {
        missing.push(`${MIN_PASSWORD_LENGTH}+ characters`);
    }

    return missing.concat(getMissingPasswordRules(password));
}

export function isPasswordValid(password = '') {
    return getPasswordRequirements(password).length === 0;
}

// The secondary PIN gates the admin sign-in prompt in AdminAuthModal, which sizes
// its boxes from the stored value, so anything from 4 to 6 digits works.
export const MIN_PIN_LENGTH = 4;
export const MAX_PIN_LENGTH = 6;

export function isValidPin(pin = '') {
    return new RegExp(`^\\d{${MIN_PIN_LENGTH},${MAX_PIN_LENGTH}}$`).test(pin);
}