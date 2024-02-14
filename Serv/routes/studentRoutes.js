const express = require("express");
const router = express.Router();
const studentController = require("../Controller/studentController");

router.get("/teachers", studentController.getTeachers);

router.post(
  "/select-teacher/:studentId/:teacherId",
  studentController.selectTeacher
);

router.get('/get_proposals/:student_id', studentController.get_proposals)

router.get('/get_comments', studentController.get_comments)


module.exports = router;
