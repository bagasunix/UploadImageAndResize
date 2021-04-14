exports.createProduct = async (req, res, next) => {
  res.status(201).json({
    status: "success",
    name: req.body.name,
    image: req.body.image,
  });
};
