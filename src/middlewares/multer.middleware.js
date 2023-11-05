import multer from 'multer';
import path from 'path';
import __dirname from '../utils.js';


const storage = multer.diskStorage( {
    destination: function (req, file, cb) {
        const fileType = file.fieldname;
        cb(null, `./src/public/${fileType}`)
      },
    filename: function(req, file, cb) {

        const uid = req.params.uid;
        const fileType = file.fieldname;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileExtension = path.extname(file.originalname);
        const documentType = req.body.documentType
        if (documentType) {
            const formattedFilename = `${uid}_${fileType}_${documentType}_${uniqueSuffix}${fileExtension}`;
            cb(null,formattedFilename);
        } else {
            const formattedFilename = `${uid}_${fileType}_${uniqueSuffix}${fileExtension}`;
            cb(null,formattedFilename);
        }
        
    }
})

export const uploader = multer({storage});

