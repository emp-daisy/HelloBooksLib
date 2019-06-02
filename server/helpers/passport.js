import passport from 'passport';
import passportjwt from 'passport-jwt';
import dotenv from 'dotenv';
import googlePlusStrategy from 'passport-google-plus-token';
import facebookStrategy from 'passport-facebook-token';
import models from '../db/models';

dotenv.config();

const jwtStrategy = passportjwt.Strategy;
const { ExtractJwt } = passportjwt;

const JWT_SECRET = process.env.SECRET_KEY;
const GOOGLE_CLIENT = process.env.google_client;
const GOOGLE_SECRET = process.env.google_secret;
const FACEBOOK_CLIENT = process.env.facebook_client;
const FACEBOOK_SECRET = process.env.facebook_secret;

const usestrategy = async (method, profile, done) => {
  try {
    if (profile) {
      profile.method = method;
      return done(null, profile);
    }
    return done('error', null);
  } catch (error) {
    done(error, false);
  }
};

passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET
    },
    async (payload, done) => {
      try {
        const user = await models.User.findOne({ where: { id: payload.id } });
        if (!user) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.use(
  'googleLogin',
  new googlePlusStrategy(
    {
      clientID: GOOGLE_CLIENT,
      clientSecret: GOOGLE_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      await usestrategy('google', profile, done);
    }
  )
);

passport.use(
  'facebookLogin',
  new facebookStrategy(
    {
      clientID: FACEBOOK_CLIENT,
      clientSecret: FACEBOOK_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      await usestrategy('facebook', profile, done);
    }
  )
);
