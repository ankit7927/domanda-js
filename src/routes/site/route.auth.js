const router = require("express").Router()
const authService = require("../../services/service.auth");
const userService = require("../../services/service.user");

router.post("/signin", async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.redirect("/signup?error=all fields required")

    try {
        const { accesToken, refreshToken, userId } = await authService.signin(email, password);
        res.cookie("refreshToken", refreshToken, {
            // enable in only production
            // httpOnly: true,
            // // secure: process.env.NOTE_ENV == "pro" ? true : false,
            // sameSite: "None",
            // maxAge: 3 * 24 * 60 * 60 * 10
        })
        return res.redirect("/")
    } catch (error) {
        return res.redirect("/signup?error=something went wrong")
    }
})

router.post("/signup", async (req, res) => {
    const { name, username, email, password, cnfpassword } = req.body
    if (!name || !username || !email || !password || !cnfpassword) return res.redirect("/signup?error=all fields required")
    if (password !== cnfpassword) return res.redirect("/signup?error=password not matched")

    try {
        await userService.newAccount(name, email, username, password)
        return res.redirect("/signin")
    } catch (error) {
        return res.redirect("/signup?error=something went wrong")
    }
})

module.exports = router;