const router = require("express").Router()

router.use("/auth", require("./route.auth"))
router.use("/user", require("./route.user"))
router.use("/question", require("./route.question"))
router.use("/answer", require("./route.answer"))

module.exports = router;