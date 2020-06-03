import express from "express";
import {
  isUnauthenticated,
  createNewUserLocal,
  findUserLocalByEmail,
} from "../helper/index.mjs";
const router = express.Router();
router.get("/", isUnauthenticated, (req, res, next) => {
  res.render("register", (err, html) => {
    if (err) {
      next(err);
    }
    res.send(html);
  });
});

router.post("/", isUnauthenticated, async (req, res, next) => {
    if (req.body) {
        const user = await findUserLocalByEmail(req.body?.email);
        if (user) {
          res.status(422).send("Email is invalid or already taken");
        }
        const result = createNewUserLocal(req.body);
        if (result) {
          res.redirect("/login");
        }
        res.send({
          success: false,
          erorr: "Sign-up not completed!!!",
        });
      }
      else res.redirect("/register");
});

export default router;
