type DateInput = string | number | Date

const DATE_PREFIX_PATTERN = /^(\d{4})-(\d{2})-(\d{2})(?:$|T|\s)/

function buildLocalDateFromParts(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day)
}

export function parseDatePreservingCalendar(input: DateInput): Date {
  if (input instanceof Date) {
    // Preserve the calendar day encoded in the source value regardless of timezone.
    return buildLocalDateFromParts(input.getUTCFullYear(), input.getUTCMonth() + 1, input.getUTCDate())
  }

  if (typeof input === "string") {
    const match = input.match(DATE_PREFIX_PATTERN)
    if (match) {
      const [, year, month, day] = match
      return buildLocalDateFromParts(Number(year), Number(month), Number(day))
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
