import VideoChat from '../models/videoChat';

export const createVideoChat = async (request, response) => {
  try {
    const { callerUserId } = request.body;
    const videoChat = await new VideoChat({
      callerUser: callerUserId,
    });

    videoChat.save();
    response.json({
      videoChat,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateVideoChatStream = async (request, response) => {
  try {
    // bodyは、{callerUserStream: streamObject}みたいな感じになるね。もしくは{recieverUserStream: streamObject}
    const file = request.file;
    console.log(file);
    console.log(request.body);
    const videoChat = await VideoChat.findById(request.params.id);
    if (request.body.calledUserStream) {
      const blob = request.body.calledUserStream;
      console.log(blob);
      videoChat.calledUserStream = blob;
    } else if (request.body.callerUserStream) {
      videoChat.recieverUserStream = request.body.recieverUserStream;
    }
    await videoChat.save();
    // videoChat.callerUserStream = request.body.stream; c=conversationStateのところもそうだけど、この書き方する時はawait doc.save()ね。
    response.json({
      videoChat,
    });
  } catch (error) {
    console.log(error);
  }
};

// export const updateVideoChatForReciever = async (request, response) => {
//   try {
//     const videoChat = await VideoChat.findByIdAndUpdate(request.params.id, request.body, {
//       new: true,
//       runValidators: false,
//     });
//   } catch (error) {
//     console.log(error)
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
