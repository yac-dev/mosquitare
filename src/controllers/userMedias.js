import fs from 'fs';
import util from 'util';
const unlinkFile = util.promisify(fs.unlink);
import S3 from 'aws-sdk/clients/s3 ';
import { AWS_S3BUCKET_NAME, AWS_S3BUCKET_REGION, AWS_S3BUCKET_ACCESS_KEY, AWS_S3BUCKET_SECRET_KEY } from '../../config';
import UserMedia from '../models/userMedia';

const s3 = new S3({
  region: AWS_S3BUCKET_REGION,
  accessKeyId: AWS_S3BUCKET_ACCESS_KEY,
  secretAccessKey: AWS_S3BUCKET_SECRET_KEY,
});

function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path); // ここでbinary dataを全て読み込んでs3に保存する。

  const uploadParams = {
    Bucket: AWS_S3BUCKET_NAME,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
}

export const createUserMedia = async (request, response) => {
  try {
    const file = request.file;
    const { userId } = request.body;
    console.log(file); // multer middlewareがあるから、ここでrequest objectのfile propertyにアクセスできる。
    // request.file.pathを使えば、postでdatabaseにfileを保村できるようになる.
    const result = await uploadFile(file); // ここ、けっこう時間かかる。もしかしたら、clientから直接やるっていう方がいいかもな。
    await unlinkFile(file.path);
    const userMedia = await UserMedia.create({ user: userId, videoFileName: file.filename });
    response.json({
      userMedia,
    });
  } catch (error) {
    console.log(error);
  }
};
