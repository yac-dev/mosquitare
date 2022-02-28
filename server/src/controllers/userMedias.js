import fs from 'fs';
import util from 'util';
const unlinkFile = util.promisify(fs.unlink);
import { AWS_S3BUCKET_NAME, AWS_S3BUCKET_REGION, AWS_S3BUCKET_ACCESS_KEY, AWS_S3BUCKET_SECRET_KEY } from '../../config';
import UserMedia from '../models/userMedia';
import Conversation from '../models/conversation';
// import ffmpeg from 'ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { getVideoDurationInSeconds } from 'get-video-duration';
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

const transcodeVideo = async (filename, conversationDuration) => {
  return new Promise((resolve, reject) => {
    const pathBefore = path.join(__dirname, '..', '..', 'uploadedFilesBuffer', filename);
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

    ffmpeg(pathBefore)
      .videoCodec('libx264')
      // .audioCodec('libmp3lame')
      .duration(conversationDuration)
      .on('end', (result) => {
        ffmpeg(pathBefore)
          .screenshots({
            timestamps: ['30%'],
            folder: pathOfScreenShots,
            filename: `transcoded-${filename}.png`,
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
    // const bodyObj = JSON.parse(JSON.stringify(request.body));
    // const { conversationId, conversationDuration } = bodyObj;
    const file = request.file;
    const userId = request.params.id;
    // 既にここで、multerによりlocalにmp4はある。getVideoDurationInSecondsの引数にlocalのmp4を使うと。
    const duration = await getVideoDurationInSeconds(file.path);
    const conversation = await Conversation.findById(request.params.conversationId);
    // 要は、最初についた人の方に実行される部分。
    if (!conversation.duration.length) {
      const userMedia = await UserMedia.create({
        user: userId,
        videoFileName: file.filename,
        // audioFileName: files[1].filename,
      });
      conversation.userMedias.push(userMedia);
      conversation.duration.push(duration);
      await conversation.save();
      response.status(200).json({
        userMedia,
      });
    } else {
      // 既に片方の人が先に着いている状態。
      const userMedia = await new UserMedia({
        user: userId,
        // videoFileName: file.filename,
        // audioFileName: files[1].filename,
      });
      const minDuration = Math.min(...conversation.duration);
      // こっからpartnerのuserMediaを引っ張ってくる。
      const partnerUserMediaFileName = conversation.userMedias[0].videoFileName;
      const transcodedFilename = await transcodeVideo(partnerUserMediaFileName, minDuration);
      const partnerUserMedia = await UserMedia.findById(conversation.userMedias[0]._id);
      partnerUserMedia.videoFileName = transcodedFilename;
      await partnerUserMedia.save();
      // partner側の変更、これで終わり。
      // 次は自分
      const myTranscodedFileName = await transcodeVideo(file.filename, minDuration);
      userMedia.videoFileName = myTranscodedFileName;
      await userMedia.save();
      // こっからawsにあげる処理を書いていく。
      const files = [transcodedFilename, myTranscodedFileName];
      files.forEach((filename) => {
        // uploadFile(file);
        uploadFile(filename);
      });
      response.status(200).json({
        success: 'blah blah',
      });
    }

    // conversationがduration array [30, 34]というデータをもつとする。
    // conversationのdurationのlengthが2になったら、数値比較して短い方のnumber使って二つのvideoのdurationをその数値で切る。
    // だから、実際conversation documentでvideoをarrayで持っておいた方がいい。うん。そうだな。だからこっからまた設計を変えていかないといけない。設計の構造を根本的に変えていかないといけないね。。。

    // const conversation = await Conversation.findById(conversationId);
    // console.log(conversation);
    // if (!conversation.duration) {
    //   conversation.duration = conversationDuration;
    //   await conversation.save();
    //   const result = await Promise.all(
    //     files.map(async (file) => {
    //       return await transcodeVideo(file, conversationDuration);
    //     })
    //   );
    //   result.forEach((filename) => {
    //     // uploadFile(file);
    //     uploadFile(filename);
    //   });
    // } else {
    //   const result = await Promise.all(
    //     files.map(async (file) => {
    //       return await transcodeVideo(file, conversation.duration);
    //     })
    //   );
    //   result.forEach((filename) => {
    //     // uploadFile(file);
    //     uploadFile(filename);
    //   });
    // }

    // ----------- これべーす。
    const result = await Promise.all(
      files.map(async (file) => {
        return await transcodeVideo(file, conversationDuration);
      })
    );

    // result.forEach((filename) => {
    //   // uploadFile(file);
    //   uploadFile(filename);
    // });
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
