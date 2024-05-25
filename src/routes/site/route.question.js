const router = require("express").Router()
const questionService = require("../../services/service.question")

router.get("/:slug", async (req, res)=> {
    const slug = req.params.slug;

    try {
        const data = await questionService.questionBySlug(slug)
        return res.render("question", data)
    } catch (error) {
        console.log(error);
        return render("notfound")
    }
})

module.exports = router;