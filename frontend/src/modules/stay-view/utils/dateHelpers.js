import { format, addDays, startOfDay } from "date-fns"

export const generateTimelineDates = (daysCount = 30) => {
    const dates = []
    const today = startOfDay(new Date())
    for (let i = 0; i < daysCount; i++) {
        const date = addDays(today, i)
        dates.push({
            fullDate: date,
            formattedDay: format(date, "EEE"),
            formattedDate: format(date, "dd MMM"),
            isToday: i === 0,
            isWeekend: parseInt(format(date, "i")) >= 6,
        })
    }
    return dates
}
