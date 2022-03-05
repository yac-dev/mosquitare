import fs from 'fs';
import util from 'util';
const unlinkFile = util.promisify(fs.unlink);
import { AWS_S3BUCKET_NAME, AWS_S3BUCKET_REGION, AWS_S3BUCKET_ACCESS_KEY, AWS_S3BUCKET_SECRET_KEY } from '../../config';
import UserMedia from '../models/userMedia';
import Conversation from '../models/conversation';
// import ffmpeg from 'ffmpeg';
import { exec } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';
// import mpegp from '@ffmpeg-installer/ffmpeg';
// const ffmpegPath = mpegp.path;
// import probep from '@ffprobe-installer/ffprobe';
// const ffprobePath = probep.path;
// ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfprobePath(ffprobePath);
// import VideoLib from 'node-video-lib';
// import { getVideoDurationInSeconds } from 'get-video-duration'; // ここでerrorるな。
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
//   /app/uploadedFilesBuffer/1646369727524-becf32ac-6a2f-4908-ab74-2b73bd8f398c.mp4
const transcodeVideo = async (filename, conversationDuration) => {
  return new Promise((resolve, reject) => {
    const pathBefore = path.join(__dirname, '..', '..', 'uploadedFilesBuffer', filename);
    // console.log(pathBefore);
    const pathOfScreenShots = path.join(__dirname, '..', '..', 'uploadedFilesBuffer', 'transcoded');
    // console.log(pathOfScreenShots);
    const transcodedFilename = `transcoded-${filename}`;
    const screenShotFilename = `transcoded-${filename}.png`;
    const pathOfTranscodedMP4 = path.join(
      __dirname,
      '..',
      '..',
      'uploadedFilesBuffer',
      'transcoded',
      transcodedFilename
    );
    // console.log(pathOfTranscodedMP4);

    ffmpeg(pathBefore)
      .output(pathOfTranscodedMP4)
      .videoCodec('libx264')
      // .audioCodec('libmp3lame')
      .setDuration(conversationDuration)
      .on('error', (error) => {
        console.log('error after setVideoDuration', error);
        reject(error);
      })
      .takeScreenshots({
        timestamps: ['00:01'],
        folder: pathOfScreenShots,
        filename: screenShotFilename,
        // size: '720x?',
      })
      .on('error', (error, stdout, stderr) => {
        console.log(error.message);
        console.log('stdout:\n' + stdout);
        console.log('stderr:\n' + stderr);
        reject(error);
      })
      .on('end', (result) => {
        resolve({ transcodedFilename, screenShotFilename });
      })
      // .on('end', (result) => {
      //   ffmpeg(pathBefore)
      //     .takeScreenshots({
      //       timestamps: ['0.5'],
      //       folder: pathOfScreenShots,
      //       filename: screenShotFilename,
      //       // size: '720x?',
      //     })
      //     .on('error', (error, stdout, stderr) => {
      //       console.log(error.message);
      //       console.log('stdout:\n' + stdout);
      //       console.log('stderr:\n' + stderr);
      //       reject(error);
      //     })
      //     .on('end', () => {
      //       resolve({ transcodedFilename, screenShotFilename });
      //     });
      // })
      // .save(pathOfTranscodedMP4);
      .run();
  });
};

// const transcodeNew = async (filename, conversationDuration) => {
//   return new Promise((resolve, reject) => {
//     const pathBefore = path.join(__dirname, '..', '..', 'uploadedFilesBuffer', filename);
//     console.log(pathBefore);
//     const pathOfScreenShots = path.join(__dirname, '..', '..', 'uploadedFilesBuffer', 'transcoded');
//     console.log(pathOfScreenShots);
//     const transcodedFilename = `transcoded-${filename}`;
//     const screenShotFilename = `transcoded-${filename}.png`;
//     const pathOfTranscodedMP4 = path.join(
//       __dirname,
//       '..',
//       '..',
//       'uploadedFilesBuffer',
//       'transcoded',
//       transcodedFilename
//     );
//     console.log(pathOfTranscodedMP4);

//     ffmpeg.ffprobe(pathBefore, (error, data) => {
//       ffmpeg(pathBefore)
//         .screenshots({
//           timestamps: ['00:01'],
//           filename: screenShotFilename,
//           folder: pathOfScreenShots,
//           count: 1,
//         })
//         .setDuration(conversationDuration)
//         .on('end', () => {
//           //upload file in 'to/wherever/you/want'(thumbnail) to s3
//           //upload the video as well to s3
//           resolve({ transcodedFilename, screenShotFilename });
//         })
//         .save(pathOfTranscodedMP4);
//     });
//   });
// };

// const getVideoDuration = async (filename) => {
//   const absPath = path.join(__dirname, '..', '..', 'uploadedFilesBuffer', filename);
//   return new Promise((resolve, reject) => {
//     fs.open(absPath, 'r', function (err, fd) {
//       try {
//         let movie = VideoLib.MovieParser.parse(fd);
//         // Work with movie
//         console.log('Duration:', movie.relativeDuration());
//         resolve(Math.floor(movie.relativeDuration()));
//       } catch (ex) {
//         console.error('Error:', ex);
//       } finally {
//         fs.closeSync(fd);
//       }
//     });
//   });
// };

export const createUserMedia = async (request, response) => {
  try {
    // const bodyObj = JSON.parse(JSON.stringify(request.body));
    // const { conversationId, conversationDuration } = bodyObj;
    const file = request.file;
    const userId = request.params.id;
    const { duration } = request.body;
    console.log(duration);
    // 既にここで、multerによりlocalにmp4はある。getVideoDurationInSecondsの引数にlocalのmp4を使うと。
    // const duration = await getVideoDurationInSeconds(file.path);
    // const duration = await getVideoDuration(file.filename); // node-video-lib、実際はblobのデータをそのままparseすることはできんみたいだ。やっぱ、videosからtimeを送るようにするか。
    const conversation = await Conversation.findById(request.params.conversationId);

    // 要は、最初についた人の方に実行される部分。
    if (!conversation.duration.length) {
      const userMedia = await UserMedia.create({
        user: userId,
        videoFileName: file.filename,
        // audioFileName: files[1].filename,
      }); // databaseに「先についた側」のvideo file名を保存しておく。まずね。multerにより、video file自体がある状態。
      conversation.userMedias.push(userMedia);
      conversation.duration.push(duration);
      await conversation.save();
      response.status(200).json({
        userMedia,
      });
      // 最初のこっちはきちんと動いている。
    } else {
      // 既に片方の人が先に着いている状態。だから、先に着いた側のuserMedia（まだlocalにある状況）、
      const minDuration = Math.min(conversation.duration[0], duration);
      conversation.duration[0] = minDuration;
      // こっからpartnerのuserMediaを引っ張ってくる。
      const partnerUserMedia = await UserMedia.findById(conversation.userMedias[0]._id);
      const transcodedFiles = await transcodeVideo(partnerUserMedia.videoFileName, minDuration);
      partnerUserMedia.videoFileName = transcodedFiles.transcodedFilename;
      partnerUserMedia.thumbnail = transcodedFiles.screenShotFilename;
      // thumbnailのong fileも返して、userMediaの方に入れようか。
      // console.log(
      //   fs.existsSync(
      //     path.join(__dirname, '..', '..', 'uploadedFilesBuffer', 'transcoded', transcodedFiles.transcodedFilename)
      //   ),
      //   'partner transcoded mp4 file exists??'
      // );
      // console.log(
      //   fs.existsSync(
      //     path.join(__dirname, '..', '..', 'uploadedFilesBuffer', 'transcoded', transcodedFiles.screenShotFilename)
      //   ),
      //   'partner transcoded screenshot file exists??'
      // );
      await partnerUserMedia.save();
      console.log('heeey, is here working????');
      // ここで、partnerのscreenshotとtranscodeされたmp4 fileがあるかの確認をしよう。

      // partner側の変更、これで終わり。
      // 次は自分
      const myTranscodedFiles = await transcodeVideo(file.filename, minDuration);
      const userMedia = await UserMedia.create({
        user: userId,
        videoFileName: myTranscodedFiles.transcodedFilename,
        thumbnail: myTranscodedFiles.screenShotFilename,
        // audioFileName: files[1].filename,
      });
      // ここでthumbnailを入れよう。
      conversation.userMedias.push(userMedia);
      await conversation.save();
      // こっからawsにあげる処理を書いていく。
      const filesToAWS = [
        transcodedFiles.transcodedFilename,
        transcodedFiles.screenShotFilename,
        myTranscodedFiles.transcodedFilename,
        myTranscodedFiles.screenShotFilename,
      ];

      filesToAWS.forEach((filename) => {
        // uploadFile(file);
        uploadFile(filename);
      });
      response.status(200).json({
        success: userMedia,
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

    // const result = await Promise.all(
    //   files.map(async (file) => {
    //     return await transcodeVideo(file, conversationDuration);
    //   })
    // );

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
