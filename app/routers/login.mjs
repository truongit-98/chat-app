import express from "express";
import passport from "passport";

import { isUnauthenticated } from "../helper/index.mjs";

const router = express.Router();
router.get("/", isUnauthenticated, async (req, res, next) => {
  try {
    res.render("login", (err, html) => {
      if (err) {
        next(err);
      }
      res.send(html);
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/", isUnauthenticated, function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send({
        success: false,
        error: "Incorrect username or password.",
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.send({
        success: true,
        url: "/chat",
      });
    });
  })(req, res, next);
});

export default router;
