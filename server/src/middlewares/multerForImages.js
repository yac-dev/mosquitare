import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    const __dirname = path.resolve();
    const destination = path.join(__dirname, './uploadedFilesBuffer');
    callback(null, destination); // 第一引数はpotential errorのこと。nullでいい。./uploadsは相対パス。
  },
  // './uploadedFilesBuffer/'
  filename: function (request, file, callback) {
    const { calledOrRecieved } = request.body;
    const extension = file.mimetype.split('/')[1];
    const finalFileName = 'user-images-' + Date.now() + '-' + uuidv4() + '.' + extension;
    callback(null, finalFileName);
  },
});

const multerParser = multer({ storage }); // buffer使ってform dataを整形したならそれを使う。
export default multerParser;
