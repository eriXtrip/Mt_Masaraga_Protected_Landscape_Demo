// QR plumbing shared by the staff jump-off desk and the public schedule lookup.
// Decoding happens entirely in the browser, so nothing is uploaded to a server.

export const getCameraErrorMessage = (error) => {
    if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError') {
        return 'Camera permission was denied. Allow camera access in your browser, then try again.';
    }
    if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') {
        return 'No camera was found on this device. Use the pass ID lookup instead.';
    }
    if (error?.name === 'NotReadableError' || error?.name === 'TrackStartError') {
        return 'The camera is already in use by another application.';
    }
    if (error?.name === 'SecurityError') {
        return 'Camera access requires a secure HTTPS connection.';
    }
    return 'The camera could not be started. Check your device and try again.';
};

// A pass QR holds the bare pass ID, but hikers also screenshot it as a whole page
// or as a wrapped JSON payload, so pull the identifier out of every shape we ship.
export const getPassIdentifier = (rawValue) => {
    const trimmedValue = rawValue.trim();
    if (!trimmedValue) return null;

    let value = trimmedValue;
    try {
        const parsedValue = JSON.parse(trimmedValue);
        if (typeof parsedValue === 'string') {
            value = parsedValue;
        } else if (parsedValue && typeof parsedValue === 'object') {
            value = parsedValue.passId || parsedValue.passID || parsedValue.id || parsedValue.code || parsedValue.value || parsedValue.data?.passId || parsedValue.data?.id || '';
        }
    } catch {
        value = trimmedValue;
    }

    if (typeof value !== 'string' || !value) return null;

    if (typeof window !== 'undefined') {
        try {
            const parsedUrl = new URL(value, window.location.origin);
            value = parsedUrl.searchParams.get('pass') || parsedUrl.searchParams.get('passId') || parsedUrl.searchParams.get('id') || value;
        } catch {
            value = value.trim();
        }
    }

    try {
        value = decodeURIComponent(value);
    } catch {
        value = value.trim();
    }

    return value.trim() || null;
};

export const createQrDetector = async () => {
    const NativeBarcodeDetector = window.BarcodeDetector;
    if (NativeBarcodeDetector) {
        try {
            const supportedFormats = await NativeBarcodeDetector.getSupportedFormats?.();
            if (!supportedFormats || supportedFormats.includes('qr_code')) {
                return new NativeBarcodeDetector({ formats: ['qr_code'] });
            }
        } catch (error) {
            void error;
        }
    }

    const { default: jsQR } = await import('jsqr');
    let canvas = null;
    let context = null;

    return {
        detect: async (video) => {
            if (!video.videoWidth || !video.videoHeight) return [];
            if (!canvas) {
                canvas = document.createElement('canvas');
                context = canvas.getContext('2d', { willReadFrequently: true });
            }
            if (!context) return [];

            const scale = Math.min(1, 720 / Math.max(video.videoWidth, video.videoHeight));
            const width = Math.max(1, Math.round(video.videoWidth * scale));
            const height = Math.max(1, Math.round(video.videoHeight * scale));
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }

            context.drawImage(video, 0, 0, width, height);
            const imageData = context.getImageData(0, 0, width, height);
            const result = jsQR(imageData.data, width, height, { inversionAttempts: 'attemptBoth' });
            return result?.data ? [{ rawValue: result.data }] : [];
        },
    };
};

export const decodeImageFile = async (file) => {
    const { default: jsQR } = await import('jsqr');
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
        bitmap.close();
        return null;
    }

    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const imageData = context.getImageData(0, 0, width, height);
    return jsQR(imageData.data, width, height, { inversionAttempts: 'attemptBoth' })?.data || null;
};