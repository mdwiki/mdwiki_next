const config = require('config');
const passport = require('koa-passport');
const GithubStrategy = require('passport-github').Strategy;

const githubStrategy = new GithubStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: config.oauth.callbackUrl,
  scope: ['public_repo']
}, (token, tokenSecret, profile, done) => {
  const user = {
    id: profile.id,
    name: profile.username,
    accessToken: token
  };
  done(null, user);
});

passport.use(githubStrategy);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
