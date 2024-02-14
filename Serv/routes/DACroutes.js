const express = require("express");
const router = express.Router();
const supervisorController = require("../Controller/supervisorController");
const pdf = require('../Models/Pdf')
const commetti = require('../Models/commetti')
const teacherData = require('../Models/TeacherRegister')
const studentData = require('../Models/studentRegister')
const multer = require('multer');
const dac = require('../Models/dac')


router.get('/get_dac/:department', async (req, res) => {
    try {
        let data = await teacherData.find({
            'department': req.params.department,
            'role': 'DAC'
        });
        res.json(data)
    } catch (err) {

    }

})


router.post('/add_new_dac', async (req, res) => {

    try {
        let teachers = []

        req.body.teachers.map((teacher) => {
            teachers.push(teacher.teacher_id);
        })

        new dac({
            'dac_title': req.body.title,
            'dac_department': req.body.department,
            'dac_members': teachers,
            'dac_head': req.body.dac_head
        }).save();

        res.json({ 'result': 'added' })

    } catch (err) {

    }


})

router.get('/get_all_dacs', async (req, res) => {

    try {
        const data = await dac.find();
        res.json(data);

    } catch (err) {

    }


})

router.post('/delete_dac', async (req, res) => {

    try {
        await dac.findOneAndDelete({
            '_id': req.body._id,
        });
        res.json({ 'result': 'deleted' })
    } catch (err) {

    }

})

router.post('/forward_to_dac', async (req, res) => {

    try {

        let pdfdata = await pdf.find({
            '_id': req.body.pdf_id
        });

        let listofteaches = await dac.find({
            '_id': req.body.dac_id
        })

        listofteaches[0].dac_members.map(async (item) => {
            await new pdf({
                'pdfName': pdfdata[0].pdfName,
                'status': 'Pending',
                'student_id': pdfdata[0].student_id,
                'teacher_id': item,
                'pdf_type': pdfdata[0].pdf_type,
            }).save();
        })

        res.status(200).json({ 'status': "forwarded" })

    } catch (err) {
        res.status(401).json({ 'status': "error forwarding" })
    }
})

module.exports = router;