const {Router} = require('express');
const router = Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'api/uploads/',
    filename: filename
});
const upload = multer({
    fileFilter: fileFilter,
    storage: storage
});

router.post('/upload', upload.single('photo'), (req, res) => {
    if(req.fileValidationError) {
        res.status(400).json({error: req.fileValidationError});
    }
    else {
        res.status(201).json({success: true});
    }
});

function fileFilter(req, file, callback) {
    if (file.mimetype !== 'image/png') {
        req.fileValidationError = 'Wrong file type';
        callback(null, false, new Error('Wrong file type'));
    } else {
        callback(null, true);
    }
}

function filename(req, file, callback) {
    callback(null, file.originalname);
}
module.exports = router;