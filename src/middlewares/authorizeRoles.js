// Middleware to check if the user has the required role
export const authorizeRoles = (role) => {
  return (req, res, next) => {
    try {
      if (role === "admin" && !req.user.isAdmin) {
        return next(
          new ApiError(403, "Access denied. Admin privileges required.")
        );
      }

      if (role === "doctor" && !req.user.isDoctor) {
        return next(
          new ApiError(403, "Access denied. Doctor privileges required.")
        );
      }

      next(); // User has the required role, proceed to the route handler
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid access token");
    }
  };
};
