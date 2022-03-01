import fs from 'fs';
import util from 'util';
const unlinkFile = util.promisify(fs.unlink);
import S3 from 'aws-sdk/clients/s3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const s3 = new S3({
  region: process.env.AWS_S3BUCKET_REGION,
  accessKeyId: process.env.AWS_S3BUCKET_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3BUCKET_SECRET_KEY,
});

export const uploadFile = async (filename) => {
  const pathOfTranscodedMP4 = path.join(__dirname, '..', '..', 'uploadedFilesBuffer', 'transcoded', filename);
  const fileStream = fs.createReadStream(pathOfTranscodedMP4); // ここでbinary dataを全て読み込んでs3に保存する。

  const uploadParams = {
    Bucket: process.env.AWS_S3BUCKET_NAME,
    Body: fileStream,
    Key: filename,
  };

  await s3.upload(uploadParams).promise();
  await unlinkFile(pathOfTranscodedMP4);
  const beforeTranscodedFilename = filename.split('.');
  // extensionがmp4なら、それはbufferにあるもの。それも消す。
  if (beforeTranscodedFilename[beforeTranscodedFilename.length - 1] === 'mp4') {
    const [transcoded, ...rest] = filename.split('-');
    const deletingFilename = rest.join('-');
    await unlinkFile(path.join(__dirname, '..', '..', 'uploadedFilesBuffer', deletingFilename));
  }
};

// keyっていうか、単純にfile名のことね。
export const getFileStream = async (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: process.env.AWS_S3BUCKET_NAME,
  };

  const data = await s3.getObject(downloadParams).promise();
  // console.log(data); // logするとすごいことになる。binary dataだから。
  return data.Body.toString('base64');
  // return data.Body.toString('utf-8');
};
