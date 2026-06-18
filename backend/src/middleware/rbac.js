function requireRoot(req, res, next) {
    if (!req.user || !req.user.is_root) {
        return res.status(403).json({ error: "Forbidden: Only Root administrative users can perform this action." });
    }
    next();
}

module.exports = {
    requireRoot
};
