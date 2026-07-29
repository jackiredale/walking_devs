const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

router.use("/auth", require("./auth"));
router.use("/watchlist", require("./watchlist"));
router.use(require("./ratings"));

module.exports = router;
