const StudentData = require("../Models/studentRegister");
const TeacherData = require("../Models/TeacherRegister");
const supervision = require('../Models/supervision');
const comment = require('../Models/comment');
const pdfmodel = require('../Models/Pdf')

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await TeacherData.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.selectTeacher = async (req, res) => {
  try {
    const { studentId, teacherId } = req.params;

    if (!studentId || !teacherId) {
      return res.status(404).json({ error: "Student or Teacher not found" });
    }

    const pdf = await pdfmodel.find({
      student_id: studentId,
      teacher_id: teacherId,
    })

    new supervision({
      student_id: studentId,
      teacher_id: teacherId,
      pdf_id: pdf[0]._id
    }).save()

    res.json({ message: "Teacher selected successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.get_proposals = async (req, res) => {
  try {


    let data = await pdfmodel.find({
      'pdf_type': 'proposal',
      'student_id': req.params.student_id
    });
    res.json(data);
  } catch (err) {

  }
}

exports.get_comments = async (req, res) => {

  try {
    let data = await comment.find();
    res.json(data)
  } catch (err) {

  }
}
