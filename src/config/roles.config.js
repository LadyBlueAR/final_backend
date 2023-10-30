export default class RolesConfig {
    static Authorize(requiredRole) {
        return async (req, res, next) => {
            try {
                const user = req.session.user;
                if (user.rol !== requiredRole) {
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