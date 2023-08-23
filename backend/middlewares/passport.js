const passport = require('passport');
const passportJWT = require('passport-jwt');
const {UsersModel} = require("../models/user.model");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const strategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  const user = await UsersModel.findById(payload.id);

  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

passport.use(strategy);


module.exports = {
  passportRoute: passport,
  protectedRoute: passport.authenticate('jwt', {session: false})
}