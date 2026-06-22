import { differenceInHours, startOfDay } from "date-fns"

export const calculateBarPosition = (
    checkIn,
    checkOut,
    timelineStartDate,
    cellWidth = 96,
) => {
    const start = new Date(checkIn)
    const timelineStart = startOfDay(new Date(timelineStartDate))

    const offsetHours = differenceInHours(start, timelineStart)
    const durationHours = differenceInHours(new Date(checkOut), start)

    const offsetDays = offsetHours / 24
    const durationDays = durationHours / 24

    return {
        left: offsetDays * cellWidth,
        width: durationDays * cellWidth,
    }
}
