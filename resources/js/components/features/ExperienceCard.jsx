import { cva } from "class-variance-authority";
import { cn } from "cn"; // or from "@/lib/utils"
import Stars from "../common/Stars";

const experienceCardVariants = cva(
    "flex flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm transition-all",
    {
        variants: {
            variant: {
                default: "border-outline-variant bg-surface-container-lowest shadow-sm",
                flat: "border-transparent bg-surface-container-low shadow-none",
                outline: "border-outline-variant bg-transparent shadow-none",
                ghost: "border-transparent bg-transparent shadow-none p-0",
            },
            size: {
                default: "p-6 gap-4",
                sm: "p-4 gap-3 text-sm",
                lg: "p-8 gap-5",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

function ExperienceCard({
    initials,
    name,
    quote,
    date,
    className,
    variant,
    size,
    rating,
    ...props
}) {
    return (
        <div
            className={cn(experienceCardVariants({ variant, size, className }))}
            {...props}
        >
            <div className="flex flex-row items-center">
                <div className="mr-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-container text-sm font-bold text-on-primary-container">
                    {initials}
                </div>
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-on-surface leading-snug">
                        {name}
                    </h3>
                    <Stars rating={rating} />
                </div>
            </div>

            <blockquote className="flex-1 text-base text-on-surface-variant">
                &ldquo;{quote}&rdquo;
            </blockquote>
        </div>
    );
}

export { ExperienceCard, experienceCardVariants };