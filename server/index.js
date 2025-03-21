import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import "./config/passportConfig.js";
import { auth } from "express-openid-connect";
import { userRoute } from "./routes/userRoute.js";
import { residencyRoute } from "./routes/residencyRoute.js";
import { buyerRoute } from "./routes/buyerRoute.js";
import { sessionLogger, ensureAuthenticated } from "./middlewares/sessionMiddleware.js";
import { authRoute } from "./routes/authRoute.js";

const app = express();
const PORT = process.env.PORT || 8200;

// 1) Create __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2) Load client.json configuration
const clientConfig = JSON.parse(fs.readFileSync("client.json", "utf8")).web;

// 3) Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://landivo.com", "http://localhost:5173"], 
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  })
);

// 4) Auth0 configuration
const auth0Config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email'
  },
};

// Apply Auth0 middleware
app.use(auth(auth0Config));

// 5) Session middleware
app.use(
  session({
    secret: process.env.AUTH0_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      sameSite: "lax", // CSRF protection
    },
  })
);

// Other middleware and configurations remain the same...
app.use(passport.initialize());
app.use(passport.session());
app.use(sessionLogger);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 6) Create an Auth0 protected middleware
const requiresAuth = (req, res, next) => {
  if (req.oidc.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
};

// 7) API routes
app.use("/api/user", userRoute);
app.use("/api/residency", residencyRoute);
app.use("/api/buyer", buyerRoute);
app.use("/api/auth", authRoute);

// 8) Auth0 routes
app.get('/profile', requiresAuth, (req, res) => {
  res.json({ 
    user: req.oidc.user,
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

// 9) Start the server
app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});