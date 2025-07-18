function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Acces interzis: rol nepotrivit" });
    }
    next();
  };
}

module.exports = requireRole;
