const modelUser = require("../models/model.user");
const modelQuestion = require("../models/model.question");
const modelAnswer = require("../models/model.answer");

const answerService = {}

answerService.newAnswer = async (userId, questionId, answer) => {
    const newAnswer = await modelAnswer.create({
        answer: answer,
        creator: userId,
    });

    const updated = await modelQuestion.findOneAndUpdate({ _id: questionId }, {
        "$push": {
            "answers": newAnswer._id
        }
    }, {new:true});
    return { "message": "answer added" }
}


module.exports = answerService;