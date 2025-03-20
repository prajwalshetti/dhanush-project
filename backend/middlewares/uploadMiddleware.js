// In uploadMiddleware.js
import multer from "multer";
import path from "path";
import crypto from 'crypto';


//import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Ensure uploads directory path is absolute
// const uploadsPath = path.join(__dirname, "..", "uploads");

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "uploads"))
      },
    filename: function (req, file, cb) {
//this crypto.randomBytes what we are doing here is we wanna generate some random name to the file we upload so that no two files 
//which are uploaded have the same name. Generates 12 bytes random name. I am using toString method to conver that to string into hexadecimal format(misture of letters and words)
//because this function by default generates in buffer
     crypto.randomBytes(12, function(err, bytes){
        const fn = bytes.toString("hex") + path.extname(file.originalname)//this particular extname extracts the extension name only from the original file name
        cb(null, fn)
     })
      
    }
  })

// // File filter (only allow images)
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);
    
//     if (extname && mimetype) {
//         return cb(null, true);
//     } else {
//         cb(new Error("Only images are allowed!"));
//     }
// };

// Initialize Multer with error handling
// const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// });
const upload = multer({ storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
 });


export default upload;