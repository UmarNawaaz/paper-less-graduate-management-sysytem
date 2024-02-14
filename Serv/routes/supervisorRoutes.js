const express = require("express");
const router = express.Router();
const supervisorController = require("../Controller/supervisorController");
const pdf = require('../Models/Pdf')

const multer = require('multer');

// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define the destination directory where the uploaded files will be stored
        cb(null, 'user_images/');
    },
    filename: function (req, file, cb) {
        // Define the filename for the uploaded file
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });



router.get("/get_sudents_with_proposals/:teacher_id", supervisorController.get_students_with_proposals);

router.get('/get_students_count_with_proposals/:teacher_id', supervisorController.get_students_count_with_proposals);

router.get("/get_sudents_with_proposals_accepted/:teacher_id", supervisorController.get_sudents_with_proposals_accepted);

router.get("/get_pdf_id/:teacher_id/:student_id", supervisorController.get_pdf_id);

router.post('/add_comment', supervisorController.add_comment)

// router.post('/approve_proposal', supervisorController.approve_proposal)

// router.post('/reject_proposal', supervisorController.reject_proposal)

// router.post('/update_proposal', supervisorController.update_proposal)

router.get('/get_user_by_id/:_id/:user_type', supervisorController.get_user_by_id)

router.post('/confirm_supervision', supervisorController.confirm_supervision);

router.get('/get_supervisor_sudents/:teacher_id', supervisorController.get_supervisor_sudents)

router.post('/get_pdf_and_comment', supervisorController.get_pdf_and_comment);

router.post('/upload_user_image', upload.single('image'), supervisorController.upload_user_image);

router.get('/get_pdf_by_id/:pdf_id', supervisorController.get_pdf_by_id);


router.post('/reject_paper', supervisorController.reject_paper)

router.post('/approve_paper', supervisorController.approve_paper)

router.post('/modify_paper', supervisorController.modify_paper)

module.exports = router;
