const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const jwtConfig = require('../config/jwt');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

export const initPassport = () => {

  /**
   * JWT Strategy
   */
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtConfig.JWT_SECRET,
  }, async (payload: { sub: string }, done: Function) => {
    try {
      // Find the user by data extracted from token
      const filter = {
        email: payload.sub,
      }
      const user = await User.findOne(filter);
      // If user doesn't exists, null means no error, false means no user
      if (!user) {
        return done(null, false);
      }
      // null means no error, and pass the user
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }));

  /**
   * Local Strategy
   */
  passport.use(new LocalStrategy({
    usernameField: 'email',
  }, async(email: String, password: String, done: Function) => {
    try {
      // Find the user given the email
      const user = await User.findOne({ 'local.email': email });
      // If user doesn't exist, null means no error, false means no user
      if (!user) {
        return done(null, false);
      }
      // Compare entered password with the one in the database
      const passwordInDB = user.local.password;
      const isMatch = await bcrypt.compare(password, passwordInDB);
      if (!isMatch) {
        // null means no error , false means no user
        return done(null, false);
      }
      // null means no error , user means user
      done(null, user);
    } catch (error) {
      //error means error , false means no user
      done(error, false);
    }
  }));
};

export const passportLogin = passport.authenticate('local', {
  session: false,
});

export const passportJWT = passport.authenticate('jwt', {
  session: false
});
