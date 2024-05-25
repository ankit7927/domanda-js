const router = require("express").Router()
const verifyJWT = require("../../middlewares/middleware.auth")
const userService = require("../../services/service.user")

router.post("/new-account", async (req, res) => {
    const { name, email, username, password } = req.body

    if (!name || !email || !username || !password)
        return res.status(404).json({ "message": "all fields required" })

    try {
        return res.json(await userService.newAccount(name, email, username, password))
    } catch (error) {
        return res.status(error.status || 500).json({ "message": "something went wrong" })
    }
})

router.put("/update", verifyJWT, async (req, res) => {
    const userId = req.user._id;
    const { name, email } = req.body

    if (!name || !email)
        return res.status(404).json({ "message": "all fields required" })

    try {
        return res.json(await userService.updateProfile(userId, name, email))
    } catch (error) {
        return res.status(error.status || 500).json({ "message": "something went wrong" })
    }
})

router.get("/get", verifyJWT,async (req, res)=> {
    const userId = req.user._id;

    try {
        return res.json(await userService.getProfile(userId))
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json({ "message": "something went wrong" })
    }
})
module.exports = router;