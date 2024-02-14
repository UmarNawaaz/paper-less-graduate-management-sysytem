const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let dacModal = new Schema({
    dac_title: {
        type: 'String'
    },
    dac_department: {
        type: String
    },
    dac_members: {
        type: [{ type: Schema.Types.ObjectId }],
    },
    dac_head: {
        type: Schema.Types.ObjectId
    }
})

module.exports = new mongoose.model('dac', dacModal);

