const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    questionId: mongoose.Schema.Types.ObjectId,
    answer: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    votes: {
        type: Number,
        default: 0
    },
})

module.exports = mongoose.model("Answer", answerSchema);
