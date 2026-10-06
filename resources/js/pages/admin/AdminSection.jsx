// TODO: Build out the individual admin sections listed in Todo.md. Until then this
// honest placeholder keeps each module openable from the sidebar without dead links.
import { useNavigate, useLocation } from 'react-router-dom';
import { Construction, LayoutDashboard, Compass } from 'lucide-react';
import { ADMIN_SECTIONS } from '../../admin/navConfig';
import { Button } from '@/components/ui/button';

export default function AdminSection() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const section = ADMIN_SECTIONS[pathname];

    if (!section) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Compass className="h-7 w-7" />
                </span>
                <h2 className="mt-5 text-xl font-bold text-on-surface">Page not found</h2>
                <p className="mt-2 max-w-md text-sm text-on-surface-variant">
                    The admin section you opened does not exist.
                </p>
                <Button
                    variant="default"
                    size="lg"
                    className="mt-6 gap-2 cursor-pointer"
                    onClick={() => navigate('/admin/dashboard')}
                >
                    <LayoutDashboard className="h-4 w-4" />
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="max-w-2xl space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Admin Console</p>
                <h2 className="text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                    {section.title}
                </h2>
                <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">
                    {section.description}
                </p>
            </header>

            <section className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-8 text-center shadow-xs md:p-12">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Construction className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-on-surface">Under construction</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-on-surface-variant">
                    This module is still being built. Check back here after the next release, or
                    return to the Dashboard to continue.
                </p>
                <Button
                    variant="outline"
                    size="lg"
                    className="mt-6 gap-2 cursor-pointer"
                    onClick={() => navigate('/admin/dashboard')}
                >
                    <LayoutDashboard className="h-4 w-4" />
                    Back to Dashboard
                </Button>
            </section>
        </div>
    );
}