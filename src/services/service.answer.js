const modelUser = require("../models/model.user");
const modelQuestion = require("../models/model.question");
const modelAnswer = require("../models/model.answer");

const answerService = {}

answerService.newAnswer = async (userId, questionId, answer) => {
    await modelAnswer.create({
        answer: answer,
        creator: userId,
        questionId: questionId
    });

    return { "message": "answer added" }
}




module.exports = answerService;