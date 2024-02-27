const mongoose = require("mongoose");
const { Schema } = mongoose;

const pdfSchema = new Schema({
  pdfName: String,
  status: {
    type: String,
    enum: ["Approved", "Pending", "Modify", "Reject", 'forward to deen'],
    default: "Pending",
  },
  student_id: {
    type: Schema.Types.ObjectId
  },
  teacher_id: {
    type: Schema.Types.ObjectId
  },
  pdf_type: {
    type: String
  },
  document_name: {
    type: String
  },
  reason: {
    type: String
  },
  forwarded_by: String,
  time: {
    text: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
});

const Pdf = mongoose.model("Pdf", pdfSchema);

module.exports = Pdf;
