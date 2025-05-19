import multer  from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/users/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime()+'-'+file.originalname);
    },
})

const filter = (req, file, cb) => {
    const allowedType = ['image/jpg', 'image/jpeg', 'image/png'];

    if (allowedType.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, JPEG and png files are allowed'), false);
    }
};

export const uploadProfilePicture = (multer({
    storage: storage,
    fileFilter: filter,
}))