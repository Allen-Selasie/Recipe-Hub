const mongoose = require("mongoose");
const {hashPassword} = require('../utilities/encryption');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            this.password = await hashPassword(this.password);
        }
        next();
    } catch (error) {
        next(error);
    }
});
const User = mongoose.model("User", userSchema);
module.exports = User;
