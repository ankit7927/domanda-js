const router = require("express").Router()
const questionService = require("../../services/service.question")

router.get("", async (req, res)=> {
    try {
        const data = await questionService.homeFeed()
        return res.render("index", data)
    } catch (error) {
        return render("notfound")
    }
    
})

module.exports = router;