const bcrypt = require('bcrypt');
const errorGen = require("../utilities/errorGen");
const modelUser = require("../models/model.user");

const userService = {}

userService.newAccount = async (name, email, username, password) => {
    const hashpass = await bcrypt.hash(password, 10);
    await modelUser.create({ username, name, email, "password": hashpass });
    return { "message": "user created" }
}

userService.updateProfile = async (userId, name, email) => {
    const existingUser = await modelUser.findOneAndUpdate({ _id: userId },
        {
            "$set": {
                name: name, email: email
            }
        },
        { new: true })
        .select("name email")
        .lean().exec();

    if (!existingUser) errorGen('user not found', 404)

    return existingUser;
}

userService.saveORremoveQuestion = async (userId, quesId) => {
    const user = await modelUser.findOne({ _id: userId })
        .select("question");

    if (!user) errorGen("user not found", 404);

    if (!user.question.saved.includes(quesId)) {
        user.question.saved.push(quesId)
        await user.save()

        return "saved"
    } else {
        user.question.saved.pull(quesId)
        await user.save()

        return "removed"
    }
}

userService.getProfile = async (userId) => {
    return await modelUser.findOne({_id:userId})
        .select("name email username")// question.asked question.answerd")
        // .populate("question.asked", "question")
        // .populate("question.answerd", "question")
        .lean().exec()
}

module.exports = userService;
