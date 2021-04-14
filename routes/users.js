const router = require("express").Router();

/* GET Controllers. */
const userC = require("../controllers/userC");
const UpImages = require("../middlewares/upUser");

// route for see results of uploaded images
app.post(
  "/products",
  UpImages.uploadUser,
  UpImages.resizerImages,
  userC.createProduct
);

module.exports = router;
