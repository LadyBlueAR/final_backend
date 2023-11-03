export default class RolesConfig {
    static Authorize(requiredRoles) {
        return async (req, res, next) => {
            try {
                const user = req.session.user;

                if (!requiredRoles.includes(user.rol)) {
                    req.logger.error("Error de permisos");
                    return res.status(403).json({ status: 'error', message: "Tu rol de usuario no te permite acceder a esta sección" });
                }

                next();
            } catch (error) {
                next(error);
            }
        }
    }
}