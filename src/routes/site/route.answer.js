const router = require("express").Router()
const verifySessionJWT = require("../../middlewares/middleware.site");
const answerService = require("../../services/service.answer")

router.post("/new-answer", verifySessionJWT, async (req, res) => {
    const userId = req.user._id;
    const { questionId, answer } = req.body;
    try {
        await answerService.newAnswer(userId, questionId, answer)
        return res.redirect("/")
    } catch (error) {
        console.log(error);
        return res.redirect("/")
    }
})

module.exports = router;