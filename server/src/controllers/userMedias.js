import fs from 'fs';
import util from 'util';
const unlinkFile = util.promisify(fs.unlink);
import { AWS_S3BUCKET_NAME, AWS_S3BUCKET_REGION, AWS_S3BUCKET_ACCESS_KEY, AWS_S3BUCKET_SECRET_KEY } from '../../config';
import UserMedia from '../models/userMedia';
import ffmpeg from 'ffmpeg';
import path from 'path';
import S3 from 'aws-sdk/clients/s3';

// const s3 = new S3({
//   region: process.env.AWS_S3BUCKET_REGION,
//   accessKeyId: process.env.AWS_S3BUCKET_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_S3BUCKET_SECRET_KEY,
// });

// const uploadFile = async (file) => {
//   const fileStream = fs.createReadStream(file.path); // ここでbinary dataを全て読み込んでs3に保存する。

//   const uploadParams = {
//     Bucket: process.env.AWS_S3BUCKET_NAME,
//     Body: fileStream,
//     Key: file.filename,
//   };

//   await s3.upload(uploadParams).promise();
//   await unlinkFile(file.path);
// };

import { uploadFile, getFileStream } from '../services/s3';

export const createUserMedia = async (request, response) => {
  try {
    const files = request.files; // 多分arryaになっているだろう。
    const userId = request.params.id;
    console.log(files); // multer middlewareがあるから、ここでrequest objectのfile propertyにアクセスできる。
    // request.file.pathを使えば、postでdatabaseにfileを保村できるようになる.
    // const result = await uploadFile(file); // ここ、けっこう時間かかる。もしかしたら、clientから直接やるっていう方がいいかもな。
    // const p = path.join(__dirname, '..');

    //undefined is not iterableだって。
    files.forEach((file) => {
      uploadFile(file);
    });

    // await unlinkFile(file.path);
    // await Promise.all(
    //   files.forEach((file) => {
    //     await unlinkFile(file.path);
    //   })
    // );
    const userMedia = await UserMedia.create({
      user: userId,
      videoFileName: files[0].filename,
      audioFileName: files[1].filename,
      // learningLanguageTextFileName: files[2].filename,
      // nativeLanguageTextFileName: files[3].filename,
    });
    console.log('Done');
    response.json({
      userMedia,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserMedia = async (request, response) => {
  try {
    const fileKey = request.params.key;

    const readStream = await getFileStream(fileKey); //promiseが返っているぽい。
    // console.log(readStream);
    response.status(200).json({
      stream: readStream,
    });
  } catch (error) {
    console.log(error);
  }
};

// export const updateUserMediaLanguageScripts = (request, response) => {
//   try {
//     // この前にuserMediaを作っているから、そのidで見つけてfieldをupdateする感じでいく感じかな。
//     const files = request.files;
//     const userId = request.params.id;
//     console.log(files);
//   } catch (error) {
//     console.log(error);
//   }
// };
