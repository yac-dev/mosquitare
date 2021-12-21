import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import S3 from 'aws-sdk/clients/s3 ';
import { AWS_S3BUCKET_NAME, AWS_S3BUCKET_REGION, AWS_S3BUCKET_ACCESS_KEY, AWS_S3BUCKET_SECRET_KEY } from '../../config';

const s3 = new S3({
  region: AWS_S3BUCKET_REGION,
  accessKeyId: AWS_S3BUCKET_ACCESS_KEY,
  secretAccessKey: AWS_S3BUCKET_SECRET_KEY,
});
// multipart form dataがくる前提で。
// 基本、request.bodyのbody parserはこういうmultipart form dataをparseすることがそもそもできないんだと。content typeが全然違う。
// url encodedかもしくはjson bodyのみ。file dataに関してはbody parserでは無理。だから、multerを使う。

// ただmultipart form dataを送るだけだと、uploadedFile/に適当な名前で保存されてしまう。extensionもない。だからここで、request.fileにアクセスしfileを色々やって整形してほぞんしなければいけない。
const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './uploadedFiles/'); // 第一引数はpotential errorのこと。nullでいい。./uploadsは相対パス。
  },
  filename: function (request, file, callback) {
    const extension = file.mimetype.split('/')[1];
    const finalFileName = Date.now() + '-' + uuidv4() + '.' + extension;
    callback(null, finalFileName);
  },
}); // 後で、ffmpegを使った方法に直すことになる。ちゃんとしたmp3に直す。file名に関してはこのやり方でいい。

// const fileFilter = (request, file, callback) => {
//   if (file.mimetype === 'video/mp4' || file.mimetype === 'audio/ogg') {
//     callback(null, true);
//   } else {
//     // ここでerror文を出してあげるといいな。
//     callback(new Error('only mp4 allowed'), false);
//   }
// };

// express.json()がbody parserの役割であるなら、mmulterはform dataに関するデータをparseしてくれる。
// const multerParser = multer({ dest: 'uploadedFiles/' }); // 先頭に/で/uploadだと絶対pathになる。きをつけろ。
const multerParser = multer({ storage }); // buffer使ってform dataを整形したならそれを使う。
export default multerParser;
