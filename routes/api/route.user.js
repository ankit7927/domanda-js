const router = require("express").Router()
const userService = require("../../services/service.user")

router.post("/new-account", async (req, res) => {
    const { name, email, username, password } = req.body

    if (!name || !email || !username || !password)
        return res.status(404).json({ "message": "all fields required" })

    try {
        return res.json(await userService.signup(name, email, username, password))
    } catch (error) {
        return res.status(error.status || 500).json({ "message": "something went wrong" })
    }
})

module.exports = router;