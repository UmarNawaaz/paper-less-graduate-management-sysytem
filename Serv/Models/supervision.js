const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const supervisionModel = new Schema({
    student_id: {
        type: Schema.Types.ObjectId
    },
    teacher_id: {
        type: Schema.Types.ObjectId
    },
    status: {
        type: String,
        default: 'pending'
    },
    reason: {
        type: String,
        default: ''
    },
    pdf_id: {
        type: Schema.Types.ObjectId
    }
})

const supervision = mongoose.model('supervision', supervisionModel);
module.exports = supervision;
