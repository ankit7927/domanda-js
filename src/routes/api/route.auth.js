const router = require("express").Router()
const authService = require("../../services/service.auth")

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(404).json({ "message": "all fields required" })

    try {
        res.json(await authService.signin(email, password))
    } catch (error) {
        return res.status(error.status || 500).json({ "message": "something went wrong" })
    }
})

router.get("/refresh", async (req, res) => {
    res.send("to be implemented")
})


module.exports = router;