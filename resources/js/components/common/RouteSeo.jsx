import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { resolveRouteSeo } from '../../lib/routeSeo';
import { applySeo } from '../../lib/seo';

/**
 * Keeps document metadata in step with the route.
 *
 * Mounted once inside the public site's BrowserRouter. Rendering null keeps it
 * out of the layout entirely: its only output is the <head>.
 */
export default function RouteSeo() {
    const { pathname } = useLocation();

    useEffect(() => {
        applySeo(resolveRouteSeo(pathname));
    }, [pathname]);

    return null;
}