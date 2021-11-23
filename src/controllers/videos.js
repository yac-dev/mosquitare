// 多分ここは、bufferとかあそこら辺を使ってpostするような記述になるかな。
import Video from '../models/video';
import fs from 'fs';
import util from 'util';
const unlinkFile = util.promisify(fs.unlink);
import S3 from 'aws-sdk/clients/s3 ';
import { AWS_S3BUCKET_NAME, AWS_S3BUCKET_REGION, AWS_S3BUCKET_ACCESS_KEY, AWS_S3BUCKET_SECRET_KEY } from '../../config';

const s3 = new S3({
  region: AWS_S3BUCKET_REGION,
  accessKeyId: AWS_S3BUCKET_ACCESS_KEY,
  secretAccessKey: AWS_S3BUCKET_SECRET_KEY,
});

function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: AWS_S3BUCKET_NAME,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
}

export const createVideo = async (request, response) => {
  try {
    const file = request.file;
    const fileStream = fs.createReadStream(file.path);
    console.log(file); // multer middlewareがあるから、ここでrequest objectのfile propertyにアクセスできる。
    // request.file.pathを使えば、postでdatabaseにfileを保村できるようになる.

    const result = await uploadFile(file); // ここ、けっこう時間かかる。もしかしたら、clientから直接やるっていう方がいいかもな。
    console.log('nvqebvqeouv');
    await unlinkFile(file.path);

    response.json({
      msg: 'helloooooooo!!!',
      result,
    });
  } catch (error) {
    console.log(error);
  }
};
