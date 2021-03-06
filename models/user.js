const mongoose = require('mongoose');

const {Schema} = mongoose;
// 생성자
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    provider: {
        type: String,
        required: false,
        default: 'local',
    }
});

module.exports = mongoose.model('User', userSchema)