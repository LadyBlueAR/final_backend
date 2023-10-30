import passport from 'passport';
import userDTO from '../DTOs/user.dto.js';

export default class SessionsController {
  static async registerUser(req, res) {
    try {
      req.logger.info("Usuario Creado");
      res.json({ status: 'success', message: 'Usuario Creado' });
    } catch (error) {
      req.logger.error("Error al crear el usuario");
      res.status(500).json({ error: 'Error al crear el usuario: ' + error });
    }
  }

  static async loginUser(req, res) {
    passport.authenticate('login', async (err, user) => {
      if (err) {
        req.logger.warning("Error al iniciar sesión");
        return res.status(500).json({ status: 'error', message: 'Error al iniciar sesión' });
      }

      if (!user) {
        req.logger.warning("Credenciales inválidas");
        return res.status(400).json({ status: 'error', message: 'Credenciales inválidas' });
      }

      req.login(user, (err) => {
        if (err) {
          req.logger.warning("Error al iniciar sesión")
          return res.status(500).json({ status: 'error', message: 'Error al iniciar sesión' });
        }
        req.logger.info("Sesión iniciada con éxito");
        req.session.user = user;
        return res.status(200).json({ status: 'success', payload: user });
      });
    })(req, res);
  }

  static async getCurrentUser(req, res) {  
      if (req.isAuthenticated()) {
      const user = req.session.user;
      const userDTOInstance = new userDTO(user);
      return userDTOInstance;
    } else {
      res.status(401).json({ status: 'error', message: 'Usuario no autenticado' });
    }
  }

  static async loginWithGithub(req, res, next) {
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
  }

  static async loginWithGithubCallback(req, res) {
    passport.authenticate('github', async (err, user) => {
      if (err) {
        req.logger.error("Error al autenticar con Github");
        return res.status(500).json({ status: 'error', message: 'Error al autenticar con GitHub' });
      }

      if (!user) {
        req.logger.error("Autenticación con Github fallida");
        return res.status(400).json({ status: 'error', message: 'Autenticación con GitHub fallida' });
      }

      req.login(user, (err) => {
        if (err) {
          req.logger.error("Error al iniciar sesión");
          return res.status(500).json({ status: 'error', message: 'Error al iniciar sesión' });
        }
        req.session.user = user;
        res.redirect('/products');
      });
    })(req, res);
  }

  static async logoutUser(req, res) {
    req.logout((err) => {
      if (err) {
        req.logger.error("Error al cerrar sesión: " + err);
        return res.status(500).json({ status: 'error', message: 'Error al cerrar sesión' });
      }
      req.logger.info("Sesión cerrada exitosamente");
      res.json({ status: 'success', message: 'Sesión cerrada exitosamente.' });
    });
  }
  
}
