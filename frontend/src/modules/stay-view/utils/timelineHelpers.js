import { differenceInHours, startOfDay, addDays } from "date-fns"

export const TIMELINE_CONFIG = {
    DAY_WIDTH_PX: 240, // Easily editable day width (240px = exactly 10px per hour)
};

export const calculateBarPosition = (
    checkIn,
    checkOut,
    timelineStartDate,
    viewDuration,
    cellWidth = TIMELINE_CONFIG.DAY_WIDTH_PX,
) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const timelineStart = startOfDay(new Date(timelineStartDate))
    const timelineEnd = addDays(timelineStart, viewDuration)

    // Calculate actual bounds for position
    const offsetHours = differenceInHours(start, timelineStart)
    
    // Clamp the end date to the timelineEnd to prevent container stretching (infinite scroll bug)
    const visibleEnd = end > timelineEnd ? timelineEnd : end;
    const durationHours = differenceInHours(visibleEnd, start)

    const offsetDays = offsetHours / 24
    const durationDays = durationHours / 24

    return {
        left: offsetDays * cellWidth,
        width: durationDays * cellWidth,
    }
}
