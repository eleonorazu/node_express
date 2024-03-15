import express from "express";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.use(cookieParser());

router.use((req, res, next) => {
  if (!req.cookies.trackingId) {
    res.cookie("trackingId", uuidv4(), { maxAge: 900000, httpOnly: true });
  }

  next();
});

router.use((req, res, next) => {
  console.log(`Visitor ${req.cookies.trackingId} visited ${req.originalUrl}`);
  next();
});

export default router;
