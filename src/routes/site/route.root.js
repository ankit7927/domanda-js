const router = require("express").Router()

router.use("", require("./route.common"));
router.use("/question", require("./route.question"));
router.use("/answer", require("./route.answer"));
router.use("/user", require("./route.user"));
router.use("/auth", require("./route.auth"));

module.exports = router;