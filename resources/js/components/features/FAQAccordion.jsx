import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function FAQAccordion({ categories = [] }) {
    const [openItems, setOpenItems] = useState({ '0-0': true, '1-0': true });

    const toggleItem = (key) => {
        setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="mx-auto max-w-3xl space-y-10 lg:max-w-4xl">
            {categories.map(({ icon: Icon, title, items }, categoryIndex) => (
                <div key={title} className="space-y-4">
                    <div className="flex items-center gap-2.5">
                        <Icon className="h-5.5 w-5.5 text-primary" />
                        <h2 className="text-lg font-extrabold tracking-tight text-primary sm:text-xl">
                            {title}
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {items.map(({ question, answer }, itemIndex) => {
                            const key = `${categoryIndex}-${itemIndex}`;
                            const isOpen = !!openItems[key];

                            return (
                                <div
                                    key={question}
                                    className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm transition-all"
                                >
                                    <Button
                                        type="button"
                                        onClick={() => toggleItem(key)}
                                        aria-expanded={isOpen}
                                        className="flex w-full items-center justify-between gap-3 p-4 text-left text-sm font-semibold text-on-surface transition-colors hover:text-primary sm:p-5 sm:text-base"
                                    >
                                        <span>{question}</span>
                                        <ChevronDown
                                            className={`h-5 w-5 shrink-0 text-primary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </Button>

                                    {isOpen && (
                                        <div className="border-t border-outline-variant/40 px-4 pb-4 pt-3 text-sm leading-relaxed text-on-surface-variant sm:px-5 sm:pb-5">
                                            {answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}