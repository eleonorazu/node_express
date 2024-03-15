import session from "express-session";

export default session({
  secret: "your secret key", // This is the secret used to sign the session ID cookie.
  resave: false, // This forces the session to be saved back to the session store, even if the session was never modified during the request.
  saveUninitialized: true, // This forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
  cookie: { secure: false }, // This option dictates whether cookies should be sent over secure connections only.
});
