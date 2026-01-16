// src/lib/motion.js
export const hapticWidgets = {
    tap: {
        scale: 0.95,
        transition: { type: "spring", stiffness: 400, damping: 15 },
    },
    hover: {
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 10 },
    },
}

export const sidebarTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
}
