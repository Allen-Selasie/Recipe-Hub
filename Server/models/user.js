const mongoose = require("mongoose");
const { hashPassword } = require('../utilities/encryption');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "https://iili.io/dKSXTua.md.png",
    },
    contact: {
        type: String,
        default: "",
    },
    loginCount: {
        type: Number,
        default: 0,
    },
    newLogin: {
        type: Boolean,
        default: true,
    },
    saves: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    }],
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
