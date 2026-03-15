module.exports = function requireRole(role) {

  return (req, res, next) => {

    if (req.session.role !== role) {
      return res.status(403).json({
        error: "Forbidden"
      });
    }

    next();

  };

};