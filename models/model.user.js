const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        requred: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        requred: true,
        unique: true,
    },
    password: {
        type: String,
        requred: true
    },
    question: {
        asked: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
        answerd: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
        saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
        voted: {
            questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
            answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }]
        }
    }
})

module.exports = mongoose.model("User", userSchema);