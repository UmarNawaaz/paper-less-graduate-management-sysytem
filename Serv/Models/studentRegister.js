const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  cnic: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
  },
  address: String,
  email: {
    type: String,
    unique: true,
  },
  department: String,
  gender: String,
  password: String,

  // image:String,
  supervisor: {
    type: Schema.Types.ObjectId,
    ref: "teacherRegistration", // Reference to the Teacher schema
  },
  proposal_status: {
    type: String
  },
  pdf: {
    type: Schema.Types.ObjectId,
    ref: "Pdf",
  },
  image_name: {
    type: String
  },
  commetti_id: {
    type: Schema.Types.ObjectId
  }
});

const userModel = mongoose.model("StudentRegistration", userSchema);
module.exports = userModel;
