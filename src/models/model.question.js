const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: {
        title: String,
        content: {
            type: String,
            required: true
        }
    },
    slug: {
        type:String,
        unique: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    tags: [String],
    votes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("Question", questionSchema);
