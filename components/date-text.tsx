import { formatDisplayDate } from "@/lib/date-utils"

interface DateTextProps {
  value: string | number | Date
  locale?: string
  options?: Intl.DateTimeFormatOptions
  className?: string
}

export function DateText({ value, locale = "en-US", options, className }: DateTextProps) {
  const formatted = formatDisplayDate(value, locale, options)
  const dateTime = value instanceof Date ? value.toISOString() : String(value)

  return (
    <time dateTime={dateTime} className={className}>
      {formatted}
    </time>
  )
}
