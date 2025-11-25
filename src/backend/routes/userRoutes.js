const router = require("express").Router();
const auth = require("../middleware/auth");
const { dashboard } = require("../controllers/userController");

router.get("/dashboard", auth, dashboard);

module.exports = router;
