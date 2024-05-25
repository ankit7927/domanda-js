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
        .select('question votes createdAt name')
        .sort({ createdAt: -1 })
        .limit(15)
        .lean()
        .exec();
}

questionService.unanswredQuestions = async () => {
    return await modelQuestion.find({ answers: { $eq: [] } })
        .select('question votes createdAt name')
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

questionService.indexQuestions = async () => {
    const result = {}
    result.latest = await modelQuestion.find({})
        .select('question')
        .sort({ createdAt: -1 })
        .limit(15).lean().exec();

    result.trending = await modelQuestion.find({})
        .select('question votes createdAt name')
        .sort({ views: -1, answers: -1 })
        .limit(10).lean().exec();

    return result;
}

// TODO check if user or question is null or not
questionService.voteQuestion = async (userId, quesId) => {
    const user = await modelUser.findOne({ _id: userId })
        .select("question")
        .exec();

    const question = await questionSchema.findById({ _id: quesId })
        .select("votes").exec();

    if (user.question.voted.questions.includes(quesId)) {
        user.question.voted.questions.pull(quesId)
        question.votes = question.votes - 1
    } else {
        user.question.voted.questions.push(quesId)
        question.votes = question.votes + 1
    }

    await user.save();
    await question.save();

    return question.votes;
}

// TODO check if user or question is null or not
questionService.voteAnswer = async (userId, quesId, ansId) => {
    const user = await modelUser.findOne({ _id: userId })
        .select("question")
        .exec();

    const question = await questionSchema.findById({ _id: quesId })
        .select("votes answers").exec()

    const x = question.answers.find(item => item._id == ansId)
    let votes = 0

    if (user.question.voted.answers.includes(ansId)) {
        user.question.voted.answers.pull(ansId)
        votes = x.votes = x.votes - 1
    } else {
        user.question.voted.answers.push(ansId)
        votes = x.votes = x.votes + 1
    }

    await user.save()
    await question.save()

    return votes
}

module.exports = questionService;