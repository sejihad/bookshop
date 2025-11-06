const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/v1/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const name = profile.displayName;
      let avatar = profile.photos[0].value;
      const googleId = profile.id;
      avatar = avatar.replace(/=s[0-9]+-c/, "=s400-c");
      try {
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name,
            email,
            avatar: { url: avatar },
            googleId,
            provider: "google",
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
