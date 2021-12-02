import Conversation from '../models/conversation';

export const createConversation = async (request, response) => {
  try {
    const { calledUserId } = request.body;
    const conversation = await Conversation.create({
      calledUser: calledUserId,
    });

    response.json({
      conversation,
    });
  } catch (error) {
    console.log(error);
  }
};

export const storeVideoFileNames = async (request, response) => {
  try {
    // ['', 'api','videoChats','upload', 'caller', 'id']
    const file = request.file;
    const endpoint = request.originalUrl.split('/')[4];
    const videoChat = await VideoChat.findById(request.params.id);
    if (endpoint === 'caller') {
      videoChat.callerStreamFileName = file.filename;
    } else if (endpoint === 'reciever') {
      videoChat.recieverStreamFileName = file.filename;
    }
    await videoChat.save();
    response.json({
      videoChat,
    });
  } catch (error) {
    console.log(error);
  }
};

// export const uploadCallerVideo = async (request, response) => {
//   try {
//     // bodyは、{callerUserStream: streamObject}みたいな感じになるね。もしくは{recieverUserStream: streamObject}

//     console.log(file);
//     const videoChat = await VideoChat.findById(request.params.id);
//     // if (request.body.caller) {
//     videoChat.callerStreamFileName = file.filename;
//     // } else if (request.body.reciever) {
//     // videoChat.recieverStreamFileName = file.filename;
//     await videoChat.save();
//     // videoChat.callerUserStream = request.body.stream; c=conversationStateのところもそうだけど、この書き方する時はawait doc.save()ね。
//     response.json({
//       videoChat,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const uploadRecieverVideo = async (request, response) => {
//   try {
//     const file = request.file;
//     const videoChat = await VideoChat.findById(request.params.id);
//     videoChat.recieverStreamFileName = file.filename;
//     await videoChat.save();
//     response.json({
//       videoChat,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const getStream = async (request, response) => {
  try {
    const videoChat = await VideoChat.findById(request.params.id);
    console.log(videoChat);
    response.json({
      videoChat,
    });
  } catch (error) {
    console.log(error);
  }
};