const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name :{ type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    //인증여부
    email_verified :{ type: Boolean, required:true, default: false },
    //인증코드
    key_for_verify :{ type: String, required:true },
});

module.exports = mongoose.model("User", UserSchema);
