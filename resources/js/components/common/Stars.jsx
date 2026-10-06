import React from 'react';

const starPath =
    'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';

function Stars({ rating = 5, maxStars = 5 }) {
    return (
        <div className="flex gap-1" aria-label={`${rating} out of ${maxStars} stars`}>
            {Array.from({ length: maxStars }).map((_, i) => {
                // Calculate the fill ratio for this star (0.0 to 1.0)
                const fillAmount = Math.max(0, Math.min(1, rating - i));
                const fillPercentage = `${fillAmount * 100}%`;
                const clipId = `star-clip-${i}-${fillPercentage.replace('%', '')}`;

                return (
                    <svg
                        key={i}
                        viewBox="0 0 24 24"
                        className="h-5 w-5 shrink-0"
                        aria-hidden="true"
                    >
                        <defs>
                            <clipPath id={clipId}>
                                <rect x="0" y="0" width={fillPercentage} height="24" />
                            </clipPath>
                        </defs>

                        {/* Base unfilled background star */}
                        <path d={starPath} className="fill-outline-variant/40" />

                        {/* Filled star foreground clipped by rating percentage */}
                        {fillAmount > 0 && (
                            <path
                                d={starPath}
                                className="fill-primary"
                                clipPath={`url(#${clipId})`}
                            />
                        )}
                    </svg>
                );
            })}
        </div>
    );
}

export default Stars;