const modelUser = require("../models/model.user");
const modelQuestion = require("../models/model.question");
const modelAnswer = require("../models/model.answer");

const questionService = {}

questionService.newQuestion = async (userId, title, content, tags, slug) => {
    const newQuestion = await modelQuestion.create({
        question: { title, content },
        creator: userId,
        slug: slug,
        tags: tags.split(",")
    });

    await modelUser.findOneAndUpdate({ _id: userId },
        {
            "$push": {
                "question.asked": newQuestion._id
            }
        })

    return newQuestion;
}

questionService.newAnswer = async (userId, questionId, answer) => {
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

questionService.latestQuestions = async () => {
    return await modelQuestion.find({})
        .select('question votes')
        .sort({ createdAt: -1 })
        .limit(15)
        .lean()
        .exec();
}

questionService.unanswredQuestions = async () => {
    return await modelQuestion.find({ answers: { $eq: [] } })
        .select('question votes')
        .limit(20)
        .sort({ createdAt: -1 })
        .lean()
        .exec();
}


questionService.questionByID = async (quesId) => {
    return await modelQuestion.findOne({ _id: quesId })
        .select("-tags")
        .populate("answers")
        .lean().exec()
}

questionService.questionBySlug = async (slug) => {
    return await modelQuestion.findOne({ slug: slug })
        .select("-tags")
        .populate("answers")
        .lean().exec()
}

questionService.questionQuery = async (query) => {
    const question = await modelQuestion.find({
        "$or": [
            {
                "question.title": {
                    $regex: query
                }
            },
            {
                "question.content": {
                    $regex: query
                }
            },
            {
                "tags": {
                    $regex: query
                }
            }
        ]
    }).select("question votes createdAt")
        .limit(16)
        .lean().exec();

    return question;
}

questionService.homeFeed = async () => {
    const result = {}
    result.latest = await modelQuestion.find({})
        .select('question')
        .sort({ createdAt: -1 })
        .limit(4).lean().exec();

    result.trending = await modelQuestion.find({})
        .select('question')
        .sort({ views: -1, answers: -1 })
        .limit(5).lean().exec();

    return result;
}


module.exports = questionService;