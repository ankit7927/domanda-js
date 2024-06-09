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

questionService.deleteQuestion = async (userId, questionId) => {
    await modelQuestion.findByIdAndDelete({ _id: questionId })
    await modelUser.findOneAndUpdate({ _id: userId }, {
        "$pull": {
            "question.asked": questionId
        }
    })

    return { message: "question deleted" }
}

questionService.latestQuestions = async () => {
    return await modelQuestion.find({})
        .select('question votes')
        .sort({ createdAt: -1 })
        .limit(15)
        .lean().exec();
}

questionService.unanswredQuestions = async () => {
    return await modelQuestion.find({ answers: { $eq: [] } })
        .select('question votes')
        .limit(20).sort({ createdAt: -1 })
        .lean().exec();
}


questionService.questionByID = async (quesId) => {
    const result = {}
    result.question = await modelQuestion.findOne({ _id: quesId })
        .select("-tags")
        .populate("creator", "name username")
        .lean().exec()

    result.answers = await modelAnswer.find({ questionId: quesId })
        .populate("creator", "name username")
        .lean().exec()

    return result
}

questionService.questionBySlug = async (slug) => {
    const result = {}
    result.question = await modelQuestion.findOne({ slug: slug })
        .select("-tags")
        .populate("creator", "name username")
        .lean().exec()
    console.log(result.question);
    result.answers = await modelAnswer.find({ questionId: result.question._id })
        .populate("creator", "name username")
        .lean().exec()

    return result
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
        .select('question votes slug')
        .sort({ createdAt: -1 })
        .limit(4).lean().exec();

    result.trending = await modelQuestion.find({})
        .select('question votes slug')
        .sort({ views: -1, answers: -1 })
        .limit(5).lean().exec();

    return result;
}

questionService.getExplore = async () => {
    return await modelQuestion.find({})
        .select('question slug')
        .sort({ createdAt: -1 })
        .limit(30).lean().exec();
}


module.exports = questionService;