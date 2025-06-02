import multer  from "multer";

// inisialisasi storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/classification/'); // Tempat penyimpanan image classification
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime()+'-'+file.originalname);
    },
})

// peizinan (hanya izinkan image)
const filter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// inisialisasi middleware multer
export const uploadBeefPicture = multer({
  storage,
  fileFilter: filter,
});