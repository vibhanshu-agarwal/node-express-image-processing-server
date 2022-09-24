const { Router } = require("express");
const router = Router();
const multer = require("multer");
const path = require("path");
//Resolve the path to the photo viewer
const photoPath = path.resolve(__dirname, "../../client/photo-viewer.html");
const imageProcessor = require("./imageProcessor");

const storage = multer.diskStorage({
  destination: "api/uploads/",
  filename: filename,
});
const upload = multer({
  fileFilter: fileFilter,
  storage: storage,
});

//Create the photo-viewer get route
router.get("/photo-viewer", (request, response) => {
  response.sendFile(photoPath);
});
//Mark our callback function as async in our post() method on the /upload route
router.post("/upload", upload.single("photo"),  async (req, res) => {
  if (req.fileValidationError) {
    res.status(400).json({ error: req.fileValidationError });
  } else {
    try {
        await imageProcessor(req.file.filename);
        res.status(201).json({ success: true });
    }
    catch (error) {
        console.log(error);
    }
  }
});

function fileFilter(req, file, callback) {
  if (file.mimetype !== "image/png") {
    req.fileValidationError = "Wrong file type";
    callback(null, false, new Error("Wrong file type"));
  } else {
    callback(null, true);
  }
}

function filename(req, file, callback) {
  callback(null, file.originalname);
}

module.exports = router;