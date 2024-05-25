const router = require("express").Router()
const answerService = require("../../services/service.answer")
const verifyJWT = require("../../middlewares/middleware.auth")

router.post("/new", verifyJWT, async (req, res) => {
    const userId = req.user._id;
    const { answer, questionId } = req.body;
    if (!answer) return res.status(404).json({ message: "answer cant be empty" })

    try {
        res.json(await answerService.newAnswer(userId, questionId, answer))
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json({ "message": "something went wrong" })
    }
});

module.exports = router;