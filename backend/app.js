require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require('express-fileupload');
const path = require("path");
const {passportRoute} = require("./middlewares/passport");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static('public'));
app.use(express.static('client'))
app.use(passportRoute.initialize());
app.use(express.json({
  limit: '1000mb'
}));
app.use(fileUpload({
  limits: { fileSize: 100 * 1024 * 1024 },
}));
const UserRouter = require("./routes/user.route");
const GoodsRouter = require("./routes/goods.route");
const WatchingRouter = require("./routes/watching.route");
const NotificationRouter = require("./routes/notification.route");

app.use("/api/users", UserRouter);
app.use("/api/goods", GoodsRouter);
app.use("/api/watching-list", WatchingRouter);
app.use("/api/notifications", NotificationRouter);

app.use(function (req, res) {
  res.sendFile(path.resolve(__dirname, './client/index.html'));
});

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
  console.log("MongoDB connected...");
  app.listen(PORT, () => {
    console.log(`The server set up at port: ${PORT}`);
  })
})