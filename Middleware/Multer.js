// const multer = require('multer');
// const path = require('path');

// // Set storage engine
// const storage = multer.diskStorage({
//   destination: './uploads/',
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// // Initialize upload
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 }, // Limit file size to 1MB
//   fileFilter: (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png|gif/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);

//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb('Error: Images only!');
//     }
//   }
// }).single('image');

// module.exports = upload;
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/api/home-makers/addHomeMaker', upload.array('images'), async (req, res) => {
    try {
        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
        // Now, save the homemaker with the imageUrls
        const homeMaker = new HomeMaker({
            name: req.body.name,
            description: req.body.description,
            imageUrls
        });
        await homeMaker.save();
        res.status(201).json(homeMaker);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
