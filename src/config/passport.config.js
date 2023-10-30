import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import UsersMongoManager from '../dao/usersMongoManager.js';
import config from './config.js';

const localStrategy = local.Strategy;
const usersManager = new UsersMongoManager();

const initializePassport = () => {
  passport.use(
    'register',
    new localStrategy(
      {
        usernameField: 'email',
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await usersManager.getUserByEmail(email);
          if (user) {
            return done(null, false, { message: 'El usuario ya existe' });
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: password,
          };
          const result = await usersManager.createUser(newUser);
          return done(null, result);
        } catch (error) {
          return done('Error al crear el usuario' + error);
        }
      }
    )
  );

  passport.use(
    'login',
    new localStrategy(
      {
        usernameField: 'email',
      },
      async (username, password, done) => {
        try {
          const user = await usersManager.authenticateUser(username, password);
          return done(null, user);
        } catch (error) {
          return done('Error al iniciar sesión' + error);
        }
      }
    )
  );

  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await usersManager.getUserByEmail(profile._json.email);
          if (!user) {
            const newUser = {
              first_name: profile._json.name.split(' ')[0],
              last_name: profile._json.name.split(' ')[1],
              email: profile._json.email,
              password: ''
            };
            const result = await usersManager.createUser(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done('Error al crear el usuario' + error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await usersManager.findUserById(id);
    done(null, user);
  });
};

export default initializePassport;
