const express = require("express");
const users = require("./user-model");
const bcrypt = require("bcryptjs");
const restricted = require("./auth/auth-router");
const router = express.Router();

router.post("/register", async (req, res, next) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  try {
    const saved = await users.add(user);
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  let { username, password } = req.body;

  try {
    const [user] = await users.findBy({ username });

    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      console.log(`User added!`);
      res.status(200).json({ message: `Welcome ${user.username}` });
    } else {
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/", restricted, (req, res, next) => {
  users
    .find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => res.send(err));
});

module.exports = router;
