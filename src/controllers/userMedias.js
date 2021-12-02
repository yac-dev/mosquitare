import fs from 'fs';
import util from 'util';
const unlinkFile = util.promisify(fs.unlink);
import S3 from 'aws-sdk/clients/s3 ';
import { AWS_S3BUCKET_NAME, AWS_S3BUCKET_REGION, AWS_S3BUCKET_ACCESS_KEY, AWS_S3BUCKET_SECRET_KEY } from '../../config';
import UserMedia from '../models/userMedia';
import ffmpeg from 'ffmpeg';
import path from 'path';

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
    const files = request.files; // 多分arryaになっているだろう。
    const userId = request.params.id;
    console.log(files); // multer middlewareがあるから、ここでrequest objectのfile propertyにアクセスできる。
    // request.file.pathを使えば、postでdatabaseにfileを保村できるようになる.
    // const result = await uploadFile(file); // ここ、けっこう時間かかる。もしかしたら、clientから直接やるっていう方がいいかもな。
    const p = path.join(__dirname, '..');
    const process = new ffmpeg(`${p}.${files[1].path}`);
    process.then((audio) => {
      audio.fnExtractSoundToMP3(`${p}.${files[1].path}`, (error, file) => {
        if (!error) {
          console.log('ok');
        }
      });
    });

    // await Promise.all(
    //   //undefined is not iterableだって。
    //   files.forEach(async (file) => {
    //     await uploadFile(file);
    //   })
    // ); // 多分結構時間がかかる。

    // await unlinkFile(file.path);
    // await Promise.all(
    //   files.forEach((file) => {
    //     await unlinkFile(file.path);
    //   })
    // );
    const userMedia = await UserMedia.create({
      user: userId,
      // videoFileName: files[0].filename,
      audioFileName: files[1].filename,
    });
    response.json({
      userMedia,
    });
  } catch (error) {
    console.log(error);
  }
};
