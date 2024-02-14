const express = require("express");
const router = new express.Router();
const nodemailer = require("nodemailer");
const cors = require("cors");
const StudentData = require("../Models/studentRegister");
const TeacherData = require("../Models/TeacherRegister");
const supervision = require('../Models/supervision');
const comment = require('../Models/comment')
const pdf = require('../Models/Pdf')

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

router.post("/emailsend", (req, res) => {
  const { email, password } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Hello! Your PGMS Account Password",
      html: `<h3>Your Account Password is Given Below </h3><br></br>
      <h3>User Name:${email}</h3>\n
      <h3>Password:${password}</h3>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error", error);
      } else {
        console.log("Success" + info.response);
        res.status(201).json({ status: 201, info });
      }
    });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});


router.post('/get_user_by_id', async (req, res) => {
  let data = '';

  switch (req.body.type) {
    case 'student':
      data = StudentData.find({ '_id': req.body._id, });
      console.log(data);
      // res.json(data);
      break;
    case 'teacher':
      data = TeacherData.find({ '_id': req.body._id, });
      console.log(data);
      // res.json(data);
      break;
  }


})

router.post('/get_comments_on_pdf', async (req, res) => {
  try {
    let data = await comment.find({
      'pdf_id': req.body._id
    });
    res.status(200).json(data);
  } catch (err) {

  }
})

router.get('/get_document_to_forward_deen', async (req, res) => {
  try {
    let data = await pdf.find({
      'status': 'forward to deen'
    })
    res.json(data);
  } catch (err) {

  }
});

module.exports = router;
