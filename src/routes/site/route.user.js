const router = require("express").Router()
const verifySessionJWT = require("../../middlewares/middleware.site");
const questionService = require("../../services/service.question");
const userService = require("../../services/service.user");

router.get("/profile", verifySessionJWT, async (req, res) => {
    const userId = req.user._id;
    try {
        const data = await userService.getProfile(userId)
        return res.render("profile", data)
    } catch (error) {
        return res.redirect("/")
    }
})

router.post("/profile", verifySessionJWT, async (req, res) => {
    const userId = req.user._id;
    const { name, email, username } = req.body

    if (!name || !username || !email) 
        return res.redirect("/user/profile?error=all fields required")

    try {
        await userService.updateProfile(userId, name, email, username)
        return res.redirect("/user/profile")
    } catch (error) {
        return res.redirect("/")
    }
})

module.exports = router;