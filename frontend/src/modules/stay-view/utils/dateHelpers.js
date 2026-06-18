import { format, addDays, startOfDay } from "date-fns"

export const generateTimelineDates = (startDate, daysCount = 30) => {
    const dates = []
    const start = startOfDay(new Date(startDate))
    const realToday = startOfDay(new Date())

    for (let i = 0; i < daysCount; i++) {
        const date = addDays(start, i)
        dates.push({
            fullDate: date,
            formattedDay: format(date, "EEE"),
            formattedDate: format(date, "dd MMM"),
            isToday: date.getTime() === realToday.getTime(),
            isWeekend: parseInt(format(date, "i")) >= 6,
        })
    }
    return dates
}
