const router = require("express").Router()
const verifySessionJWT = require("../../middlewares/middleware.site")
const questionService = require("../../services/service.question")

router.get("", async (req, res) => {
    try {
        const data = await questionService.homeFeed()
        return res.render("index", data)
    } catch (error) {
        return res.render("notfound")
    }
})

router.get("/explore", async (req, res) => {
    try {
        const data = await questionService.getExplore()
        return res.render("questions", {questions:data})
    } catch (error) {
        return res.render("notfound")
    }
})

router.get("/new-question", verifySessionJWT, (req, res) => {
    res.render("newquestion")
});

router.get("/signin", (req, res) => {
    const error = req.query.error;
    return res.render("signin", { error })
});

router.get("/signup", (req, res) => {
    const error = req.query.error;
    return res.render("signup", { error })
});

module.exports = router;