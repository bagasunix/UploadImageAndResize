const multer = require("multer");
const MulterSharpResizer = require("multer-sharp-resizer");

const multerStorage = multer.memoryStorage();

const uploadUser = multer({
  storage: multerStorage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image");

// Check file Type
function checkFileType(file, cb) {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png/;
  // Check ext
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: Images Only !!!");
  }
}

module.exports = {
  uploadUser,
  resizerImages: async (req, res, next) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, "0");

    const filename = (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    };

    const sizes = [
      {
        path: "original",
        width: null,
        height: null,
      },
      {
        path: "medium",
        width: 300,
        height: 450,
      },
      {
        path: "thumbnail",
        width: 100,
        height: 250,
      },
    ];

    const uploadPath = `public/images/user/${year}/${month}/${req.body.id}`;

    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/images/user/${year}/${month}/${req.body.id}`;

    // sharp options
    const sharpOptions = {
      fit: "fill",
      background: { r: 255, g: 255, b: 255 },
    };

    // create a new instance of MulterSharpResizer and pass params
    const resizeObj = new MulterSharpResizer(
      req,
      filename,
      sizes,
      uploadPath,
      fileUrl,
      sharpOptions
    );

    // call resize method for resizing files
    await resizeObj.resize();
    const getDataUploaded = resizeObj.getData();

    req.body.image = getDataUploaded.image;

    next();
  },
};
