const router = require("express").Router()
const questionService = require("../../services/service.question")
const verifyJWT = require("../../middlewares/middleware.auth")

router.get("/get/:questionId", async (req, res) => {
    const questionId = req.params.questionId;

    try {
        res.json(await questionService.questionByID(questionId))
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json({ "message": "something went wrong" })
    }
})

router.get("/get/slug/:slug", async (req, res) => {
    const slug = req.params.slug;

    try {
        res.json(await questionService.questionBySlug(slug))
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json({ "message": "something went wrong" })
    }
})

router.post("/new", verifyJWT, async (req, res) => {
    const userId = req.user._id;
    const { title, content, tags } = req.body;
    if (!content) return res.status(404).json({ message: "question cant be empty" })

    const slug = title?.replace(" ", "-") + "-" + content.slice(0, 22).replace(" ", "-")

    try {
        res.json(await questionService.newQuestion(userId, title, content, tags, slug))
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json({ "message": "something went wrong" })
    }
});

router.delete("delete/:questionId", verifyJWT, async (req, res) => {
    const questionId = req.params.questionId;

    try {
        res.json(await questionService.deleteQuestion(questionId))
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json({ "message": "something went wrong" })
    }
})

router.get("/query", async (req, res) => {
    const query = req.query.query;

    if (!query) return res.json({message:"query cant be empty"})

    try {
        res.json(await questionService.questionQuery(query))
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json({ "message": "something went wrong" })
    }
})

router.get("/latest", async (req, res)=> {
    try {
        res.json(await questionService.latestQuestions())
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json({ "message": "something went wrong" })
    }
})

router.get("/unanswerd", async (req, res)=> {
    try {
        res.json(await questionService.unanswredQuestions())
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json({ "message": "something went wrong" })
    }
})

router.get("/home-feed", async (req, res)=> {
    try {
        res.json(await questionService.homeFeed())
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json({ "message": "something went wrong" })
    }
})

router.get("/explore", async (req, res)=> {
    try {
        res.json(await questionService.getExplore())
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json({ "message": "something went wrong" })
    }
})

module.exports = router;