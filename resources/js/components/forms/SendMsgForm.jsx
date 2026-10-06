import { ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function SendMsgForm() {
    return (
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm md:p-10">
            <h3 className="mb-6 text-2xl font-bold text-primary md:text-3xl">
                Send us a Message
            </h3>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                <div>
                    <label
                        htmlFor="name"
                        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-on-surface"
                    >
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your full name"
                        className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface shadow-sm transition-all placeholder:text-on-surface-variant/70 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-on-surface"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="your.email@example.com"
                        className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface shadow-sm transition-all placeholder:text-on-surface-variant/70 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label
                        htmlFor="category"
                        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-on-surface"
                    >
                        Category
                    </label>
                    <div className="relative">
                        <select
                            id="category"
                            name="category"
                            defaultValue=""
                            className="w-full cursor-pointer appearance-none rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 pr-10 text-sm text-on-surface-variant shadow-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="" disabled>
                                Select an inquiry category
                            </option>
                            <option value="permits">Permits & Scheduling</option>
                            <option value="fees">Payment & Fees</option>
                            <option value="guides">Accredited Guides</option>
                            <option value="conservation">Conservation & Research</option>
                            <option value="other">General Inquiries</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant" />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="message"
                        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-on-surface"
                    >
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows="4"
                        placeholder="How can we help you?"
                        className="w-full resize-y rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface shadow-sm transition-all placeholder:text-on-surface-variant/70 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="pt-2">
                    <Button
                        type="button"
                        variant="default"
                        size="lg"
                    >
                        Submit Inquiry
                    </Button>
                </div>
            </form>
        </div>
    );
}