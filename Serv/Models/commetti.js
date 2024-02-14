const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let commettiModal = new Schema({
    commetti_title: {
        type: 'String'
    },
    commetti_department: {
        type: String
    },
    commetti_members: {
        type: [{ type: Schema.Types.ObjectId }],
    },
    commetti_head: {
        type: Schema.Types.ObjectId
    }
})

module.exports = new mongoose.model('commetti', commettiModal);

