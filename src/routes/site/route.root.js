const router = require("express").Router()

router.use("", require("./route.common"));
router.use("/question", require("./route.question"));

module.exports = router;