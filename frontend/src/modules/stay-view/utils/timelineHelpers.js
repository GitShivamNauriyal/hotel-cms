import { differenceInDays, startOfDay } from "date-fns"

export const calculateBarPosition = (
    checkIn,
    checkOut,
    timelineStartDate,
    cellWidth = 96,
) => {
    const start = startOfDay(new Date(checkIn))
    const timelineStart = startOfDay(new Date(timelineStartDate))

    const offsetDays = differenceInDays(start, timelineStart)
    const duration = differenceInDays(new Date(checkOut), start)

    return {
        left: offsetDays * cellWidth,
        width: duration * cellWidth,
    }
}
