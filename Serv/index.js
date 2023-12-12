// const express = require("express");
// const dotenv = require("dotenv").config();
// const cors = require("cors");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const router = require("./routes/router");
// const authRouter = require("./routes/authRoutes"); // Added authRouter
// const pdfRoutes = require("./routes/pdfRoutes");
// const studentRoutes = require("./routes/studentRoutes");

// require("dotenv").config();

// const app = express();

// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("DataBase Connected"))
//   .catch(err => console.log(err));

// app.use(cors());
// // Middleware
// app.use(express.json());
// app.use("/files", express.static("files")); // Serve uploaded files statically

// // Routes
// app.use("/api", pdfRoutes);
// app.use("/students", studentRoutes);

// app.use(cookieParser());
// app.use(express.urlencoded({extended: false}));

// // Send email
// app.use(router);
// app.use("/", authRouter); // Use authRouter for your authentication routes

// const port = 5000;
// app.listen(port, () => console.log("listening on port", port));




// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const pdfRoutes = require("./routes/pdfRoutes");
// const studentRoutes = require("./routes/studentRoutes");
// const authRoutes = require("./routes/authRoutes");

// require("dotenv").config();

// const app = express();

// mongoose
//   .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Database Connected"))
//   .catch((err) => console.error("Database connection error:", err));

// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// app.use(express.json());
// app.use("/files", express.static("files")); // Serve uploaded files statically
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: false }));

// // Routes
// app.use("/api", pdfRoutes);
// app.use("/students", studentRoutes);
// app.use("/", authRoutes);

// const port = 5000;
// app.listen(port, () => console.log("Listening on port", port));





const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const router = require("./routes/router");
const authRouter = require("./routes/authRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const studentRoutes = require("./routes/studentRoutes");

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

app.use("/api", pdfRoutes);
app.use("/students", studentRoutes);

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(router);
app.use("/", authRouter);

const port = 5000;
app.listen(port, () => console.log("listening on port", port));

