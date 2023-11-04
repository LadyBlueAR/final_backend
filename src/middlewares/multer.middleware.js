import multer from 'multer';
import path from 'path';
import __dirname from '../utils.js';

function getFolder(req, file, cb) {

    const fileType = req.params.fileType;
    let folder = '';    
    switch (fileType) {
        case 'profile':
            folder = 'public/img/profile';
            break;
        case 'product' :
            folder = 'public/img/products';
            break;
        case 'document' :
            folder = 'public/documents';
            break;
    }

    return cb(null, path.join(__dirname, folder));
}

const storage = multer.diskStorage( {
    destination: getFolder,
    filename: function(req, file, cb) {
        const uid = req.params.uid;
        const fileType = req.params.fileType;
        const fileExtension = path.extname(file.originalname);
        const formattedFilename = `${uid}_${fileType}${fileExtension}`;
        cb(null,formattedFilename);
    }
})

export const uploader = multer({storage});

