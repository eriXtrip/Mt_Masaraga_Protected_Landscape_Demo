const RENDER_DPI = 300;
const CSS_DPI = 96;

export const A4_DOCUMENT = {
    widthInches: 8.27,
    heightInches: 11.69,
};

export function waitForImages(element) {
    const images = Array.from(element.querySelectorAll('img'));
    return Promise.all(images.map((image) => {
        if (image.complete) return Promise.resolve();
        return new Promise((resolve) => {
            image.addEventListener('load', resolve, { once: true });
            image.addEventListener('error', resolve, { once: true });
        });
    }));
}

// Renders a live DOM node to a PNG at print resolution and saves it. Extracted from
// DigitalPassDownloadModal so passes and system-generated documents share one method.
export function downloadElementAsImage(element, { fileName, widthInches, heightInches }) {
    return (async () => {
        const { toBlob } = await import('html-to-image');
        await waitForImages(element);

        const blob = await toBlob(element, {
            backgroundColor: '#ffffff',
            cacheBust: true,
            canvasHeight: Math.round(heightInches * RENDER_DPI),
            canvasWidth: Math.round(widthInches * RENDER_DPI),
            height: heightInches * CSS_DPI,
            pixelRatio: 1,
            skipAutoScale: true,
            skipFonts: true,
            style: {
                boxSizing: 'border-box',
                height: `${heightInches}in`,
                margin: '0',
                transform: 'none',
                transformOrigin: 'top left',
                width: `${widthInches}in`,
            },
            width: widthInches * CSS_DPI,
        });

        if (!blob) throw new Error('The document image could not be created.');

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    })();
}
