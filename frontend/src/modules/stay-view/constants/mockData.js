import { source } from "motion/react-client"

export const MOCK_RESOURCES = [
    { id: "101", type: "Deluxe" },
    { id: "102", type: "Deluxe" },
    { id: "103", type: "Executive" },
    { id: "104", type: "Single" },
]

export const MOCK_RESERVATIONS = [
    {
        id: "R101",
        roomId: "101",
        guest: "Alex Smith",
        checkin: "2026-01-21",
        checkout: "2026-01-24",
        status: "Checked-in",
        source: "makemytrip.com",
    },
    {
        id: "R102",
        roomId: "103",
        guest: "Maria Garcia",
        checkin: "2026-01-23",
        checkout: "2026-01-26",
        status: "Confirmed",
        source: "trivago.com",
    },
]
