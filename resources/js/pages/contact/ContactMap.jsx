import { ExternalLink, MapPin } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useAdminStore } from '../../state/adminStore';

const CENTER_LAT = 13.31859;
const CENTER_LON = 123.59756;
const ZOOM = 14;
const TILE_SIZE = 256;
const GRID_COLS = 9;
const GRID_ROWS = 5;
const MAP_URL = 'https://maps.app.goo.gl/393u11nnWZpdLjB69';

const degToRad = (deg) => (deg * Math.PI) / 180;

const toTile = (lat, lon, zoom) => {
    const n = 2 ** zoom;
    return {
        x: ((lon + 180) / 360) * n,
        y: ((1 - Math.log(Math.tan(degToRad(lat)) + 1 / Math.cos(degToRad(lat))) / Math.PI) / 2) * n,
    };
};

export default function ContactMap() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const { settings } = useAdminStore();
    const contact = settings?.contact || {};
    const latitude = Number(contact.latitude);
    const longitude = Number(contact.longitude);
    const centerLat = Number.isFinite(latitude) && contact.latitude !== '' ? latitude : CENTER_LAT;
    const centerLon = Number.isFinite(longitude) && contact.longitude !== '' ? longitude : CENTER_LON;
    const mapUrl = contact.mapUrl || MAP_URL;
    const officeAddress = contact.officeAddress || settings?.general?.officeAddress || 'Brgy. Amtic, Ligao City, Albay';

    const centerTile = toTile(centerLat, centerLon, ZOOM);
    const x0 = Math.floor(centerTile.x) - Math.floor(GRID_COLS / 2);
    const y0 = Math.floor(centerTile.y) - Math.floor(GRID_ROWS / 2);
    const dx = (centerTile.x - Math.floor(centerTile.x)) * TILE_SIZE;
    const dy = (centerTile.y - Math.floor(centerTile.y)) * TILE_SIZE;

    const markerX = Math.floor(GRID_COLS / 2) * TILE_SIZE + dx;
    const markerY = Math.floor(GRID_ROWS / 2) * TILE_SIZE + dy;

    return (
        <section ref={sectionRef} className={`relative h-96 w-full overflow-hidden border-y border-outline-variant bg-surface-container transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div
                className="absolute left-1/2 top-1/2"
                style={{
                    width: GRID_COLS * TILE_SIZE,
                    height: GRID_ROWS * TILE_SIZE,
                    marginLeft: -(markerX),
                    marginTop: -(markerY),
                }}
            >
                {Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => {
                    const col = i % GRID_COLS;
                    const row = Math.floor(i / GRID_COLS);
                    const tileUrl =
                        `https://a.tile.opentopomap.org/${ZOOM}/${x0 + col}/${y0 + row}.png`;
                    return (
                        <img
                            key={`${col}-${row}`}
                            src={tileUrl}
                            alt=""
                            draggable={false}
                            className="absolute select-none"
                            style={{ left: col * TILE_SIZE, top: row * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}
                        />
                    );
                })}
            </div>

            <div className="pointer-events-none absolute inset-0 bg-primary/5 mix-blend-multiply" />

            <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 shadow-sm sm:left-6">
                <MapPin className="h-4 w-4 text-primary" />
                <div className="text-xs">
                    <p className="font-semibold text-on-surface">{settings?.general?.siteName || 'Mt. Masaraga Protected Landscape'}</p>
                    <p className="text-on-surface-variant">{officeAddress}</p>
                </div>
                <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto ml-2 inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold bg-primary text-on-secondary transition-colors hover:bg-primary-container"
                >
                    Open
                    <ExternalLink className="h-3.5 w-3.5" />
                </a>
            </div>

            <div className="pointer-events-none absolute bottom-2 right-2 z-10 rounded bg-surface-container-lowest/90 px-2 py-0.5 text-[10px] text-on-surface-variant">
                © OpenStreetMap &amp; OpenTopoMap
            </div>
        </section>
    );
}