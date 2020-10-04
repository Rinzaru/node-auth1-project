const express = require("express");
const userRouter = require("./users/user-router");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const knexsessionStore = require("connect-session-knex")(session);
const server = express();

const sessionConfig = {
  name: "Starting Session",
  secret: "This is a secret",
  cookie: {
    maxAge: 60 * 60 * 1000,
    secure: false,
    httpsOnly: true,
  },
  resave: false,
  saveUninitialize: true,

  store: new knexsessionStore({
    knex: require("./config"),
  }),
};

server.use(session(sessionConfig));
server.use(helmet());
server.use(cors());
server.use(express.json());
server.use("/api/users", userRouter);
server.use(userRouter);

server.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    message: "Something went wrong",
  });
});

server.get("/", (req, res) => {
  res.json({ api: "Open" });
});

module.exports = server;
