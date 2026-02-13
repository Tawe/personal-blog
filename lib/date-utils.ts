type DateInput = string | number | Date

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

export function parseDatePreservingCalendar(input: DateInput): Date {
  if (typeof input === "string") {
    const match = input.match(DATE_ONLY_PATTERN)
    if (match) {
      const [, year, month, day] = match
      return new Date(Number(year), Number(month) - 1, Number(day))
    }
  }

  return new Date(input)
}

export function getDateTimestamp(input: DateInput): number {
  return parseDatePreservingCalendar(input).getTime()
}

export function formatDisplayDate(
  input: DateInput,
  locale: string = "en-US",
  options?: Intl.DateTimeFormatOptions,
): string {
  return parseDatePreservingCalendar(input).toLocaleDateString(locale, options)
}
