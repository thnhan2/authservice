const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        isRequired: true
    },
    email: {
        type: String,
        isRequired: true
    },
    phone: {
        type: String,
        isRequired: true
    },
    password: {
        type: String,
        isRequired: true
    },
    role: {
        type: String,
        isRequired: true
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;