import fs from 'fs';
import util from 'util';
const unlinkFile = util.promisify(fs.unlink);
import S3 from 'aws-sdk/clients/s3';

const s3 = new S3({
  region: process.env.AWS_S3BUCKET_REGION,
  accessKeyId: process.env.AWS_S3BUCKET_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3BUCKET_SECRET_KEY,
});

export const uploadFile = async (file) => {
  const fileStream = fs.createReadStream(file.path); // ここでbinary dataを全て読み込んでs3に保存する。

  const uploadParams = {
    Bucket: process.env.AWS_S3BUCKET_NAME,
    Body: fileStream,
    Key: file.filename,
  };

  await s3.upload(uploadParams).promise();
  await unlinkFile(file.path);
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
