import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import db from "./db.js";

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
}, (accessToken, refreshToken, profile, done) => {
  db.get("SELECT * FROM users WHERE google_id=?", [profile.id], (err, user) => {
    if (err) return done(err);
    if (user) return done(null, user);

    // Cambié la arrow function por function para que this.lastID funcione
    db.run(
      "INSERT INTO users(google_id, name, email) VALUES(?,?,?)",
      [
        profile.id,
        profile.displayName,
        profile.emails?.[0]?.value || ""
      ],
      function(err) {
        if (err) return done(err);
        // Aquí this.lastID funciona correctamente
        db.get("SELECT * FROM users WHERE id=?", [this.lastID], (err, newUser) => done(err, newUser));
      }
    );
  });
}));

export default passport;
