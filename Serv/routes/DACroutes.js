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

        //forwarded by teacher
        let teacher_data = await teacherData.find({
            '_id': req.body.commetti_member_id
        })

        listofteaches[0].dac_members.map(async (item) => {

            const alphabet = 'abcdefghijklmnopqrstuvwxyz';
            let randomName = '';
            for (let i = 0; i < 15; i++) {
                const randomIndex = Math.floor(Math.random() * alphabet.length);
                randomName += alphabet[randomIndex];
            }
            // fs.copyFile(`files/${pdfdata[0].pdfName}`,`files/copiedfile.pdf`,())
            const sourceFilePath = path.join(__dirname, '..', 'files', `${pdfdata[0].pdfName}`);
            const destinationFilePath = path.join(__dirname, '..', 'files', randomName + '.pdf');

            // Read the PDF file
            fs.readFile(sourceFilePath, (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    return;
                }

                // Write the PDF file with a new name
                fs.writeFile(destinationFilePath, data, (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        return;
                    }
                    console.log('File copied successfully!');
                });
            });


            await new pdf({
                'pdfName': randomName + '.pdf',
                'status': 'Pending',
                'student_id': pdfdata[0].student_id,
                'teacher_id': item,
                'pdf_type': pdfdata[0].pdf_type,
                'document_name': pdfdata[0].document_name,
                'forwarded_by': `${teacher_data[0].name} (${teacher_data[0].role})`
            }).save();

            // await new pdf({
            //     'pdfName': pdfdata[0].pdfName,
            //     'status': 'Pending',
            //     'student_id': pdfdata[0].student_id,
            //     'teacher_id': item,
            //     'pdf_type': pdfdata[0].pdf_type,
            // }).save();
        })

        await studentData.findOneAndUpdate({
            '_id': pdfdata[0].student_id
        }, {
            'commetti_acceptence': 'accepted'
        })

        res.status(200).json({ 'status': "forwarded" })

    } catch (err) {
        res.status(401).json({ 'status': "error forwarding" })
    }
})

module.exports = router;