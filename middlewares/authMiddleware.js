import passport from 'passport';
import bcrypt from 'bcryptjs';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy, ExtractJwt } from 'passport-jwt';
import FaceStrategy from 'passport-facebook';
import crypto from 'crypto';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtPassport = passport.use(
  new Strategy(opts, async (jwt_payload, done) => {
    try {
      console.log('JWT Payload: ', jwt_payload);
      const user = await User.findOne({ where: { userId: jwt_payload.id } });

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

const verifyUser = passport.authenticate('jwt', { session: false });

const verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as Admin');
  }
};

const FacebookStrategy = FaceStrategy.Strategy;

const facebookPassport = passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENTID,
      clientSecret: process.env.FACEBOOK_CLIENTSECRET,
      callbackURL: process.env.FACEBOOK_CALLBACKURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log(profile);
        // console.log(profile.displayName);
        // console.log(profile.emails[0].value);
        // const { emails, name } = profile._json;
        const userData = await User.findOne({
          where: { name: profile.displayName },
        });

        // console.log(userData);

        if (userData) {
          return done(null, userData);
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(
            crypto.randomBytes(20).toString('hex'),
            salt
          );

          const user = await User.create({
            email:
              profile.emails &&
              profile.emails.length > 0 &&
              profile.emails[0].value !== undefined
                ? profile.emails[0].value
                : 'facebookoauth@mail.com',
            name: profile.displayName,
            password: hashPassword,
            mobile: '0000000000',
          });

          console.log(user);

          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

const facebookAuthenticate = passport.authenticate('facebook', {
  session: false,
});

const facebookCallbackAuthenticate = passport.authenticate('facebook', {
  session: false,
  successRedirect: '/api/users/profile',
  failureRedirect: '/api/users/login',
});

const googlePassport = passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET,
      callbackURL: process.env.GOOGLE_CALLBACKURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = await User.findOne({
          where: { email: profile.emails[0].value },
        });
        if (userData) {
          return done(null, userData);
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(
            crypto.randomBytes(20).toString('hex'),
            salt
          );

          const user = await User.create({
            email: profile.emails[0].value,
            name: profile.displayName,
            password: hashPassword,
            mobile: '0000000000',
          });

          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

const googleAuthenticate = passport.authenticate('google', {
  session: false,
  scope: ['profile', 'email'],
});

const googleCallbackAuthenticate = passport.authenticate('google', {
  session: false,
  successRedirect: '/api/users/profile',
  failureRedirect: '/api/users/login',
});

export {
  jwtPassport,
  verifyUser,
  verifyAdmin,
  facebookPassport,
  facebookAuthenticate,
  facebookCallbackAuthenticate,
  googlePassport,
  googleAuthenticate,
  googleCallbackAuthenticate,
};
