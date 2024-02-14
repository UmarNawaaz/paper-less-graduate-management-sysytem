const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const router = require("./routes/router");
const authRouter = require("./routes/authRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const studentRoutes = require("./routes/studentRoutes");
const supervisorRoutes = require('./routes/supervisorRoutes')
const commettiRoutes = require('./routes/commettiRoutes')
const dacRoutes=require('./routes/DACroutes')

require("dotenv").config();

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DataBase Connected"))
  .catch((err) => console.log(err));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use("/files", express.static("files"));
app.use('/user_images', express.static('user_images'));

app.use("/api", pdfRoutes);
app.use("/students", studentRoutes);

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(router);
app.use("/", authRouter);
app.use(supervisorRoutes);
app.use(commettiRoutes);
app.use(dacRoutes);

const port = 5000;
app.listen(port, () => console.log("listening on port", port));

