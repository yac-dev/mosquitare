import Conversation from '../models/conversation';

export const createConversation = async (request, response) => {
  try {
    console.log(request.body);
    const { calledUser } = request.body;
    const conversation = await Conversation.create({
      calledUser: request.body.calledUser,
    });
    response.json({
      conversation,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateConversationRecievedUser = async (request, response) => {
  try {
    const { recievedUser } = request.body;
    const conversation = await Conversation.findById(request.params.id);
    console.log(conversation, 'updateRecieved working!');
    conversation.recievedUser = recievedUser;
    await conversation.save();
    response.json({
      conversation,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateConversationUserMedia = async (request, response) => {
  try {
    const conversation = await Conversation.findById(request.params.id);
    if (request.body.calledUserMedia) {
      console.log('caled user media side');
      conversation.calledUserMedia = request.body.calledUserMedia;
    } else if (request.body.recievedUserMedia) {
      console.log('recieved user media side');
      conversation.recievedUserMedia = request.body.recievedUserMedia;
    }
    await conversation.save();
    response.status(200).json({
      conversation,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateConversationUserScript = async (request, response) => {
  try {
    const conversation = await Conversation.findById(request.params.id);
    if (request.body.calledUserScript) {
      console.log('caled user script side ');
      conversation.calledUserScript = request.body.calledUserScript;
    } else if (request.body.recievedUserScript) {
      console.log('recieved user script side ');
      conversation.recievedUserScript = request.body.recievedUserScript;
    }
    await conversation.save();
    response.status(200).json({
      conversation,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateConversationIntegratedUserMedia = async (request, response) => {
  try {
    const { integratedUserMedia } = request.body;
    console.log(integratedUserMedia);
    const conversation = await Conversation.findById(request.params.id);
    conversation.integratedUserMedia = request.body.integratedUserMedia;
    await conversation.save();
    response.json({
      conversation,
    });
  } catch (error) {
    console.log(error);
  }
};

// export const storeVideoFileNames = async (request, response) => {
//   try {
//     // ['', 'api','videoChats','upload', 'caller', 'id']
//     const file = request.file;
//     const endpoint = request.originalUrl.split('/')[4];
//     const videoChat = await VideoChat.findById(request.params.id);
//     if (endpoint === 'caller') {
//       videoChat.callerStreamFileName = file.filename;
//     } else if (endpoint === 'reciever') {
//       videoChat.recieverStreamFileName = file.filename;
//     }
//     await videoChat.save();
//     response.json({
//       videoChat,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

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

// export const getStream = async (request, response) => {
//   try {
//     const videoChat = await VideoChat.findById(request.params.id);
//     console.log(videoChat);
//     response.json({
//       videoChat,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
