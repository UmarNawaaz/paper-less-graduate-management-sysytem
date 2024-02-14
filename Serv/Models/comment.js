const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const commentModel = new Schema({
    text: {
        type: String,
        required: true
    },
    student_id: {
        type: Schema.Types.ObjectId
    },
    teacher_id: {
        type: Schema.Types.ObjectId
    },
    pdf_id: {
        type: Schema.Types.ObjectId
    },
    status: {
        type: String,
        default: 'unseen'
    }
})

const comment = mongoose.model('comment', commentModel);
module.exports = comment;
