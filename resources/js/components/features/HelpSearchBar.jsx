import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function HelpSearchBar() {
    return (
        <form className="relative mx-auto w-full max-w-2xl">
            <Search className="pointer-events-none absolute left-4.5 top-1/2 h-5.5 w-5.5 -translate-y-1/2 text-on-surface-variant" />
            <input
                type="text"
                placeholder="Search for topics (e.g., 'Rescheduling', 'Health Certificate')"
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-4 pl-12.5 pr-24 text-sm text-on-surface shadow-sm transition-all placeholder:text-on-surface-variant/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:text-base"
            />
            <Button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-3 py-4 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-primary-container sm:text-sm"
            >
                Search
            </Button>
        </form>
    );
}