import * as React from "react"
import { cn } from "@/lib/utils"
import { DayPicker, getDefaultClassNames } from "react-day-picker"
import { ChevronLeftIcon, ChevronRightIcon, CheckCircle2 } from "lucide-react"

const SlotContext = React.createContext({ provided: false, map: {}, allowUnscheduled: false, disableScheduled: false })

// The calendar renders in a 408px-wide admin drawer and in an 810px-wide booking
// column, so every size steps on container tiers (@sm 24rem, @lg 32rem, @3xl 48rem)
// rather than viewport breakpoints.
const DAY_CELL = "h-14 @sm:h-16 @lg:h-20 @3xl:h-24"
const DAY_CELL_FRAME = "relative border-t border-l border-outline-variant/10 transition-colors group"
const DAY_BADGE = "absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-full text-[12px] font-medium @sm:top-1.5 @sm:left-1.5 @sm:h-6 @sm:w-6 @sm:text-[13px] @lg:top-2 @lg:left-2 @lg:h-7 @lg:w-7 @lg:text-sm"
const SLOT_BOX = "absolute bottom-1 left-1 right-1 @sm:bottom-1.5 @sm:left-1.5 @sm:right-1.5 @lg:bottom-2 @lg:left-2 @lg:right-2"
const PILL = "truncate rounded px-1 py-0.5 text-center text-[9px] font-medium leading-tight @lg:py-1 @lg:text-[10px] @3xl:px-2 @3xl:text-[11px]"

const TONE_OPEN = "bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary-container"
const TONE_LIMITED = "bg-[#fef08a]/30 text-[#854d0e] transition-colors group-hover:bg-[#fef08a]"
const TONE_FULL = "bg-surface-variant/60 text-on-surface-variant"
const TONE_NONE = "bg-surface-variant/40 text-on-surface-variant"

const LEGEND_ITEMS = [
  { label: "Available", swatch: "border-primary bg-primary/10" },
  { label: "Limited Space", swatch: "border-[#ca8a04] bg-[#fef08a]" },
  { label: "Fully Booked / Closed", swatch: "border-outline-variant/50 bg-surface-variant" },
]

// Slot maps are keyed by local calendar date, never by UTC, so the key is built
// from the date parts instead of an en-CA locale string.
function toDateKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  locale,
  disabled,
  slots,
  allowUnscheduled = false,
  disableScheduled = false,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames()

  const slotContext = React.useMemo(
    () => ({ provided: slots !== undefined, map: slots || {}, allowUnscheduled, disableScheduled }),
    [slots, allowUnscheduled, disableScheduled]
  )

  const today = React.useMemo(() => new Date(), [])
  const startOfCurrentMonth = React.useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
    [today]
  )

  const tomorrow = React.useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    [today]
  )

  return (
    <div className="@container relative w-full">
      <SlotContext.Provider value={slotContext}>
        <DayPicker
          startMonth={startOfCurrentMonth}
          disabled={disabled ?? { before: tomorrow }}
          showOutsideDays={showOutsideDays}
          className={cn("group/calendar relative w-full", className)}
          captionLayout={captionLayout}
          locale={locale}
          formatters={{
            weekday: (day) =>
              day
                .toLocaleDateString(locale?.code || "en-US", {
                  weekday: "short",
                })
                .slice(0, 2),
          }}
          classNames={{
            root: cn("w-full"),
            months: cn("flex w-full flex-col gap-y-3"),

            // Make navigation position relative to the month
            month: cn("relative flex w-full flex-col"),

            // Navigation stays on the right side
            nav: cn(
              "absolute right-0 top-0 z-10 flex items-center gap-1 @lg:gap-1.5"
            ),

            button_previous: cn(
              "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-outline-variant/50 text-on-surface-variant transition-colors hover:bg-surface-variant disabled:pointer-events-none disabled:opacity-30 @lg:h-10 @lg:w-10"
            ),

            button_next: cn(
              "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-outline-variant/50 text-on-surface-variant transition-colors hover:bg-surface-variant disabled:pointer-events-none disabled:opacity-30 @lg:h-10 @lg:w-10"
            ),

            // The caption keeps room for the absolutely positioned nav buttons,
            // which only widen at the @lg tier.
            month_caption: cn(
              "mb-2 w-full"
            ),

            month_grid: cn(
              "mt-1 w-full table-fixed border-collapse overflow-hidden rounded-lg border border-outline-variant/20 bg-outline-variant/20 shadow-sm",
              defaultClassNames.month_grid
            ),

            weekdays: cn(
              "bg-surface border-b border-outline-variant/20"
            ),

            weekday: cn(
              "px-1 py-2 text-center text-[11px] font-medium text-on-surface-variant @lg:p-2 @lg:text-xs @xl:p-3 @xl:text-sm"
            ),

            week: cn("w-full"),

            day: cn(
              "m-0 p-[0.5px] focus-within:relative focus-within:z-20"
            ),

            outside: cn("opacity-50"),
            hidden: cn("invisible"),

            ...classNames,
          }}

          components={{
            MonthCaption: ({ className, calendarMonth }) => (
              <div className={cn("flex w-full min-w-0 flex-col gap-1.5", className)}>
                <div className="min-w-0 truncate pr-20 text-lg font-bold text-on-surface @sm:text-xl @lg:pr-24 @3xl:text-2xl">
                  {calendarMonth.date.toLocaleString(locale?.code || "en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <AvailabilityLegend />
              </div>
            ),

            Chevron: ({ className, orientation, ...props }) => {
              if (orientation === "left") {
                return (
                  <ChevronLeftIcon
                    className="h-4 w-4 @lg:h-5 @lg:w-5"
                    {...props}
                  />
                )
              }

              if (orientation === "right") {
                return (
                  <ChevronRightIcon
                    className="h-4 w-4 @lg:h-5 @lg:w-5"
                    {...props}
                  />
                )
              }

              return null
            },

            DayButton: (props) => (
              <CalendarDayButton {...props} />
            ),
          }}

          {...props}
        />
      </SlotContext.Provider>
    </div>
  )
}

// Below @lg a pill only has room for the count, from @lg for a short phrase and
// from @xl for the full phrase.
function SlotPill({ tone, compact, medium, wide }) {
  return (
    <div className={cn(PILL, tone)}>
      <span className="@lg:hidden">{compact}</span>
      <span className="hidden @lg:inline @xl:hidden">{medium}</span>
      <span className="hidden @xl:inline">{wide}</span>
    </div>
  );
}

function AvailabilityLegend() {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 border-t border-outline-variant/20 pt-2 @lg:gap-x-4">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div className={cn("h-3 w-3 shrink-0 rounded-full border @lg:h-4 @lg:w-4", item.swatch)} />
          <span className="whitespace-nowrap text-[11px] text-on-surface-variant @lg:text-xs">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function CalendarDayButton({ day, modifiers, className, "aria-label": ariaLabel, ...props }) {
  const isSelected = modifiers.selected;
  const isOutside = modifiers.outside;
  const isToday = modifiers.today;
  const isDisabled = modifiers.disabled;

  const dateKey = toDateKey(day.date);

  const slotContext = React.useContext(SlotContext);
  const { provided: hasSlotInfo, map: slotMap, allowUnscheduled, disableScheduled } = slotContext;

  const hasSchedule = hasSlotInfo && slotMap[dateKey] !== undefined;
  const slotCount = hasSchedule ? slotMap[dateKey] : null;

  const dayNum = day.date.getDate();
  const isLimited = hasSchedule && slotCount > 0 && slotCount <= 3;
  const isFullyBooked = hasSchedule && slotCount === 0;
  const isUnscheduled = hasSlotInfo && !hasSchedule;
  const isScheduledBlocked = hasSchedule && (isFullyBooked || disableScheduled);
  const isBlocked = isOutside || isDisabled || isScheduledBlocked || (isUnscheduled && !allowUnscheduled);

  const availabilityLabel = !isOutside && !isDisabled
    ? isFullyBooked
      ? "Fully booked"
      : isUnscheduled
        ? "No schedule"
        : isLimited
          ? `${slotCount} slots left`
          : `${slotCount} slots open`
    : null;

  let dayWrapperClass = cn(DAY_CELL, DAY_CELL_FRAME, "bg-surface-container-lowest");
  if (isSelected) {
    dayWrapperClass = cn(DAY_CELL, DAY_CELL_FRAME, "z-10 cursor-pointer border-primary/30 bg-primary/5 ring-2 ring-inset ring-primary");
  } else if (isBlocked) {
    dayWrapperClass = cn(DAY_CELL, DAY_CELL_FRAME, "cursor-not-allowed border-outline-variant/30 bg-surface-variant/40");
  } else {
    dayWrapperClass = cn(dayWrapperClass, "cursor-pointer hover:bg-surface-container");
  }

  return (
    <button
      {...props}
      aria-label={availabilityLabel ? `${ariaLabel}, ${availabilityLabel}` : ariaLabel}
      className={cn("h-full w-full appearance-none text-left focus:ring-2 focus:ring-inset focus:ring-primary", className)}
      type="button"
      disabled={isBlocked}
    >
      <div className={dayWrapperClass}>
        <div className={cn(
          DAY_BADGE,
          isSelected ? "bg-primary text-on-primary font-bold shadow-sm" :
            isToday ? "border-2 border-outline-variant text-on-surface-variant font-bold" :
              isDisabled ? "text-on-surface-variant/80" :
                "text-on-surface"
        )}>
          {dayNum}
        </div>

        {(!isOutside && !isDisabled && hasSlotInfo) && (
          <div className={SLOT_BOX}>
            {isSelected ? (
              <div className="flex items-center justify-center gap-1 @xl:justify-between">
                <CheckCircle2 className="text-primary h-4 w-4 shrink-0 fill-primary/10" />
                <span className="hidden truncate rounded bg-primary/10 px-1.5 py-1 text-[10px] font-bold text-primary @xl:block">Selected</span>
              </div>
            ) : isUnscheduled ? (
              allowUnscheduled ? null : (
                <div className={cn(PILL, TONE_NONE, "hidden @xl:block")}>No schedule</div>
              )
            ) : isFullyBooked ? (
              <SlotPill tone={TONE_FULL} compact="0" medium="Full" wide="Fully Booked" />
            ) : isLimited ? (
              <SlotPill
                tone={TONE_LIMITED}
                compact={slotCount}
                medium={`${slotCount} left`}
                wide={`${slotCount} slots left`}
              />
            ) : (
              <SlotPill
                tone={TONE_OPEN}
                compact={slotCount}
                medium={`${slotCount} open`}
                wide={`${slotCount} slots open`}
              />
            )}
          </div>
        )}

        {isDisabled && !isOutside && (
          <div className={SLOT_BOX}>
            <div className={cn(PILL, TONE_NONE, "hidden @xl:block")}>
              {isToday ? "Today closed" : "Unavailable"}
            </div>
          </div>
        )}
      </div>
    </button>
  )
}

export { Calendar, CalendarDayButton }