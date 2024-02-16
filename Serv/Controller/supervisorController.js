const StudentData = require("../Models/studentRegister");
const TeacherData = require("../Models/TeacherRegister");
const supervision = require('../Models/supervision')
const pdf = require('../Models/Pdf')
const comment = require('../Models/comment');
const dac = require('../Models/dac');

exports.get_students_with_proposals = async (req, res) => {
    try {
        const pending_students = await pdf.find({ "teacher_id": req.params.teacher_id, 'pdf_type': 'proposal' });
        res.json(pending_students);

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.get_students_count_with_proposals = async (req, res) => {
    try {
        const pending_students = await supervision.find({ "teacher_id": req.params.teacher_id, 'status': 'pending' });
        const approved_students = await supervision.find({ "teacher_id": req.params.teacher_id, 'status': 'approved' });
        const rejected_students = await supervision.find({ "teacher_id": req.params.teacher_id, 'status': 'rejected' });
        const tomodify_students = await supervision.find({ "teacher_id": req.params.teacher_id, 'status': 'modify' });
        const modified_students = await supervision.find({ "teacher_id": req.params.teacher_id, 'status': 'modified' });

        let mystudentscount = await StudentData.find({
            'supervisor': req.params.teacher_id
        })


        res.json({
            pending_students: pending_students.length,
            approved_students: approved_students.length,
            rejected_students: rejected_students.length,
            tomodify_students: tomodify_students.length,
            modified_students: modified_students.length,
            mystudentscount: mystudentscount.length
        });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.get_pdf_id = async (req, res) => {
    try {
        const foundpdf = await pdf.find({ "teacher_id": req.params.teacher_id, 'student_id': req.params.student_id });
        res.json(foundpdf[0]._id);

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }

}

exports.add_comment = async (req, res) => {

    try {
        let pdfdata = await pdf.find({
            _id: req.body.pdf_id
        });

        new comment({
            text: req.body.text,
            teacher_id: req.body.teacher_id,
            student_id: pdfdata[0].student_id,
            pdf_id: req.body.pdf_id
        }).save()

        res.json({ "result": "added" });
    } catch (err) {

    }
}

// exports.approve_proposal = async (req, res) => {

//     await supervision.findOneAndUpdate({
//         pdf_id: req.body.pdf_id,
//         teacher_id: req.body.teacher_id
//     }, {
//         status: 'approved'
//     }).then((response) => {
//         // res.json({ 'data': 'approved' })
//     })
//     res.json({ 'data': 'Approved' })
// }

// exports.reject_proposal = async (req, res) => {

//     supervision.findOneAndUpdate({
//         pdf_id: req.body.pdf_id,
//         teacher_id: req.body.teacher_id
//     }, {
//         status: 'rejected',
//         reason: req.body.reason
//     }).then((response) => {
//         // res.json({ 'data': 'approved' })
//     })
//     res.json({ 'data': 'Rejected' })
// }

// exports.update_proposal = async (req, res) => {

//     supervision.findOneAndUpdate({
//         pdf_id: req.body.pdf_id,
//         teacher_id: req.body.teacher_id
//     }, {
//         status: 'modify',
//         reason: req.body.reason
//     }).then((response) => {
//         // res.json({ 'data': 'approved' })
//     })
//     res.json({ 'data': 'Modified' })

// }

exports.get_sudents_with_proposals_accepted = async (req, res) => {

    try {
        const students = await supervision.find({ "teacher_id": req.params.teacher_id, 'status': 'approved' });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }


}

exports.get_user_by_id = async (req, res) => {

    try {
        let data = '';
        switch (req.params.user_type) {
            case 'student':
                data = await StudentData.find({ '_id': req.params._id, });
                res.json(data);
                break;
            case 'teacher':
                data = await TeacherData.find({ '_id': req.params._id, });
                res.json(data);
                break;
        }
    } catch (err) {

    }
}

exports.confirm_supervision = async (req, res) => {

    try {
        await StudentData.findOneAndUpdate({
            _id: req.body.student_id
        }, {
            'supervisor': req.body.teacher_id,
            'proposal_status': 'Approved'
        });
        res.json({ "result": "Confirmed" });
    } catch (err) {

    }
}

exports.get_pdf_and_comment = async (req, res) => {
    try {
        let pdfdata = await pdf.find({
            'teacher_id': req.body.teacher_id,
            'student_id': req.body.student_id,
            'pdf_type': 'proposal'
        });

        res.json(pdfdata);
    } catch (err) {

    }
}

exports.get_supervisor_sudents = async (req, res) => {

    try {
        let data = await StudentData.find({
            'supervisor': req.params.teacher_id
        })
        res.json(data);
    } catch (err) {

    }
}

exports.upload_user_image = async (req, res) => {

    try {
        switch (req.body.user_type) {
            case "teacher":
                await TeacherData.findOneAndUpdate({
                    '_id': req.body._id
                }, {
                    'image_name': req.file.filename
                })
                break;

            case 'student':
                await StudentData.findOneAndUpdate({
                    '_id': req.body._id
                }, {
                    'image_name': req.file.filename
                })
                break;
        }

        res.status(200).json({ 'result': "uploaded" })
    } catch (err) {

    }
}


exports.get_pdf_by_id = async (req, res) => {

    try {
        let data = await pdf.find({
            '_id': req.params.pdf_id
        });
        res.json(data[0]);
    } catch (exe) {

    }

}


exports.approve_paper = async (req, res) => {

    try {
        await pdf.findOneAndUpdate({
            '_id': req.body.pdf_id,
            'teacher_id': req.body.teacher_id
        }, {
            'status': 'approved'
        })


        let dacdata = await dac.find({
            'dac_head': req.body.teacher_id
        })

        if (dacdata.length > 0) {

            let pdf_data = await pdf.find({
                '_id': req.body.pdf_id
            });
            await new pdf({
                'pdfName': pdf_data[0].pdfName,
                'status': 'forward to deen',
                'student_id': pdf_data[0].student_id,
                'teacher_id': req.body.teacher_id,
                'pdf_type': 'paper'
            }).save();

            await StudentData.findOneAndUpdate({
                '_id': pdf_data[0].student_id
            }, {
                'dac_acceptence': 'accepted'
            })

        }

        res.json({ 'result': "approved" });
    } catch (err) {

    }
}

exports.modify_paper = async (req, res) => {

    try {
        await pdf.findOneAndUpdate({
            '_id': req.body.pdf_id,
            'teacher_id': req.body.teacher_id
        }, {
            'status': 'modify',
            'reason': req.body.reason
        })

        res.json({ 'result': "Submitted" });
    } catch (err) {

    }

}

exports.reject_paper = async (req, res) => {
    try {
        await pdf.findOneAndUpdate({
            '_id': req.body.pdf_id,
            'teacher_id': req.body.teacher_id
        }, {
            'status': 'rejected',
            'reason': req.body.reason
        })

        res.json({ 'result': "rejected" });
    } catch (err) {

    }
}

