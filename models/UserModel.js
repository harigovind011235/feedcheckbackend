const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, min: 4, unique: true },
  password: { type: String, required: true },
  employeename: { type: String, required: true },
  employeeID: { type: String, min: 5, max: 8, required: true },
  isadmin:{type:Boolean,default:false,required:false}
});

const UserModel = model('User',UserSchema);

module.exports = UserModel;