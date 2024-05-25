const modelUser = require("../models/model.user");
const modelQuestion = require("../models/model.question");
const modelAnswer = require("../models/model.answer");
const errorGen = require("../utilities/errorGen");

const answerService = {}

answerService.newAnswer = async (userId, questionId, answer)=> {
    const newAnswer = await modelAnswer.create({
        answer: answer,
        creator: userId,
    });

    await modelQuestion.findOneAndUpdate({ _id: questionId }, {
        "$push": {
            "answers": newAnswer._id
        }
    });

    return { "message": "answer added" }
}


module.exports = answerService;