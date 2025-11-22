/**
 * Format a date to IST (Indian Standard Time - UTC+5:30)
 * @param date - Date string or Date object
 * @returns Formatted date and time string in IST
 */
function normalizeDateInput(date: string | Date): Date {
    if (date instanceof Date) {
        return date
    }

    const trimmed = date.trim()
    if (!trimmed) {
        return new Date(NaN)
    }

    const isoMatch = trimmed.match(
        /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2})(\.\d{1,6})?)?(?:\s*(Z|[+-]\d{2}(?::?\d{2})?))?$/
    )

    if (isoMatch) {
        const [, year, month, day, hour, minute, second = '00', fraction = '', tz = 'Z'] = isoMatch

        const milliseconds = fraction
            ? Number(fraction.slice(1).padEnd(3, '0').slice(0, 3))
            : 0

        const yearNum = Number(year)
        const monthNum = Number(month) - 1
        const dayNum = Number(day)
        const hourNum = Number(hour)
        const minuteNum = Number(minute)
        const secondNum = Number(second)

        const baseUtcMs = Date.UTC(yearNum, monthNum, dayNum, hourNum, minuteNum, secondNum, milliseconds)

        if (!tz || tz === 'Z') {
            return new Date(baseUtcMs)
        }

        const sign = tz.startsWith('-') ? -1 : 1
        const tzBody = tz.slice(1)
        const hasMinutes = tzBody.includes(':') || tzBody.length > 2
        const tzHours = Number(tzBody.slice(0, 2))
        const tzMinutes = hasMinutes ? Number(tzBody.slice(-2)) : 0
        const offsetMinutes = sign * (tzHours * 60 + tzMinutes)

        return new Date(baseUtcMs - offsetMinutes * 60 * 1000)
    }

    // Fallback to native parsing for any other formats
    return new Date(trimmed)
}

export function formatToIST(date: string | Date | null): string {
    if (!date) return "Never"

    const dateObj = typeof date === 'string' ? normalizeDateInput(date) : date
    if (isNaN(dateObj.getTime())) return "Invalid date"

    // Create formatter for IST
    const istFormatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    })

    return istFormatter.format(dateObj)
}

/**
 * Format a date to IST date only
 * @param date - Date string or Date object
 * @returns Formatted date string in IST
 */
export function formatDateToIST(date: string | Date | null): string {
    if (!date) return "Never"

    const dateObj = typeof date === 'string' ? normalizeDateInput(date) : date
    if (isNaN(dateObj.getTime())) return "Invalid date"

    const istFormatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    })

    return istFormatter.format(dateObj)
}

/**
 * Format a date to IST with relative time (e.g., "2 hours ago")
 * @param date - Date string or Date object
 * @returns Relative time string or formatted IST time
 */
export function formatRelativeToIST(date: string | Date | null): string {
    if (!date) return "Never"

    const dateObj = typeof date === 'string' ? normalizeDateInput(date) : date
    if (isNaN(dateObj.getTime())) return "Invalid date"
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`

    return formatToIST(date)
}
