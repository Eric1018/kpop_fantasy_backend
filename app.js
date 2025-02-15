var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var dotenv = require("dotenv");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var carDataRoutes = require("./routes/CardData");
var loginRouter = require("./routes/login");
var signinRouter = require("./routes/signin"); // ✅ 新增 signin 路由
var purchaseRouter = require("./routes/purchase");
var userCardsRouter = require("./routes/userCards");
var myIdolRouter = require("./routes/myidol");


dotenv.config();

var app = express();

// 設定 view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// 中間件設定
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// 設定路由
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/CardData", carDataRoutes);
app.use("/api/login", loginRouter);
app.use("/api/signin", signinRouter); // ✅ 註冊 signin API 路由
app.use("/api/purchase", purchaseRouter);
app.use("/api/userCards", userCardsRouter);
app.use("/api/myidol", myIdolRouter);

// 處理 404 錯誤
app.use(function (req, res, next) {
  next(createError(404));
});

// 錯誤處理
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
