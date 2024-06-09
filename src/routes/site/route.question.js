const router = require("express").Router()
const verifySessionJWT = require("../../middlewares/middleware.site");
const questionService = require("../../services/service.question")

router.post("/new", verifySessionJWT, async (req, res) => {
    const userId = req.user._id;
    const { title, content, tags } = req.body;
    if (!content) return res.redirect("/question/new?error=question cant be empty")

    const slug = title?.replace(" ", "-") + "-" + content.slice(0, 22).replace(" ", "-")

    try {
        await questionService.newQuestion(userId, title, content, tags, slug)
        return res.redirect("/")
    } catch (error) {
        return res.redirect("/question/new?error=something went wrong")
    }
});

router.get("/get/:slug", async (req, res) => {
    const slug = req.params.slug;
    
    try {
        const data = await questionService.questionBySlug(slug)
        console.log(data);
        return res.render("question", data)
    } catch (error) {
        console.log(error);
        return res.render("notfound")
    }
});

module.exports = router;