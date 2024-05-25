const router = require("express").Router()

router.use("/auth", require("./route.auth"))
router.use("/user", require("./route.user"))

module.exports = router;