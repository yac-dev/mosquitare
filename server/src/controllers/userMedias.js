import fs from 'fs';
import util from 'util';
const unlinkFile = util.promisify(fs.unlink);
import { AWS_S3BUCKET_NAME, AWS_S3BUCKET_REGION, AWS_S3BUCKET_ACCESS_KEY, AWS_S3BUCKET_SECRET_KEY } from '../../config';
import UserMedia from '../models/userMedia';
import Conversation from '../models/conversation';
// import ffmpeg from 'ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import S3 from 'aws-sdk/clients/s3';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

const transcodeVideo = async (file, conversationDuration) => {
  return new Promise((resolve, reject) => {
    const pathOfScreenShots = path.join(__dirname, '..', '..', 'uploadedFilesBuffer', 'transcoded');
    const transcodedFilename = `transcoded-${file.filename}`;
    const pathOfTranscodedMP4 = path.join(
      __dirname,
      '..',
      '..',
      'uploadedFilesBuffer',
      'transcoded',
      transcodedFilename
    );

    ffmpeg(file.path)
      .videoCodec('libx264')
      // .audioCodec('libmp3lame')
      .duration(conversationDuration)
      .on('end', (result) => {
        ffmpeg(file.path)
          .screenshots({
            timestamps: ['30%'],
            folder: pathOfScreenShots,
            filename: `transcoded-${file.filename}.png`,
            size: '720x?',
          })
          .on('error', (error) => {
            reject(error);
          })
          .on('end', () => {
            // resolve();
            resolve(transcodedFilename);
          });
      })
      .save(pathOfTranscodedMP4);
  });
};

export const createUserMedia = async (request, response) => {
  try {
    const bodyObj = JSON.parse(JSON.stringify(request.body));
    const { conversationId, conversationDuration } = bodyObj;
    const files = request.files;
    const userId = request.params.id;
    // request.file.pathを使えば、postでdatabaseにfileを保村できるようになる.
    // const result = await uploadFile(file); // ここ、けっこう時間かかる。もしかしたら、clientから直接やるっていう方がいいかもな。
    // const p = path.join(__dirname, '..');
    // console.log(p);

    // videoとaudioが来るんだよね。とりあえず、videoだけでいんだよね。処理するのは。
    // 一旦コメントアウト

    // for (const file of files) {
    //   await transcodeVideo(file, conversationDuration);
    // }
    const conversation = await Conversation.findById(conversationId);
    console.log(conversation);
    if (!conversation.duration) {
      conversation.duration = conversationDuration;
      await conversation.save();
      const result = await Promise.all(
        files.map(async (file) => {
          return await transcodeVideo(file, conversationDuration);
        })
      );
      result.forEach((filename) => {
        // uploadFile(file);
        uploadFile(filename);
      });
    } else {
      const result = await Promise.all(
        files.map(async (file) => {
          return await transcodeVideo(file, conversation.duration);
        })
      );
      result.forEach((filename) => {
        // uploadFile(file);
        uploadFile(filename);
      });
    }

    // ----------- これべーす。
    const result = await Promise.all(
      files.map(async (file) => {
        return await transcodeVideo(file, conversationDuration);
      })
    );

    result.forEach((filename) => {
      // uploadFile(file);
      uploadFile(filename);
    });
    // ------------------

    // if (!conversation.duration) {
    //   conversation.duration = request.body.duration;
    //   await conversation.save();
    //   // await transcodeVideo(`../uploadedFilesBuffer${file}`,file,request.body.duration );
    // } else {
    //   const process = new ffmpeg(file);
    //   process.then(
    //     (video) => {
    //       video.setVideoDuration(conversation.duration).save('mpegedVideo.mp4', function (error, file) {
    //         if (!error) console.log('Video file: ' + file);
    //       });
    //     },
    //     function (err) {
    //       console.log('Error: ' + err);
    //     }
    //   );
    // }
    // 一旦コメントアウト

    // 一旦コメントアウト
    // //undefined is not iterableだって。
    // files.forEach((file) => {
    //   uploadFile(file);
    // });
    // 一旦コメントアウト

    // const userMedia = await UserMedia.create({
    //   user: userId,
    //   videoFileName: files[0].filename,
    //   audioFileName: files[1].filename,
    // });
    response.json({
      // userMedia,
      ok: 'ok',
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
