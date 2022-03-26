import Conversation from '../models/conversation';

export const createConversation = async (request, response) => {
  try {
    console.log(request.body);
    const { userId } = request.body;
    const { genre } = request.body;
    const conversation = await new Conversation();
    conversation.users.push(userId);
    conversation.genre = genre;
    await conversation.save();
    response.json({
      conversation,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateConversationUsers = async (request, response) => {
  try {
    const { userId } = request.body;
    const conversation = await Conversation.findById(request.params.id);
    console.log(conversation, 'updateRecieved working!');
    conversation.users.push(userId);
    await conversation.save();
    response.json({
      conversation,
    });
  } catch (error) {
    console.log(error);
  }
};

// こいつはもう使わない。
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

export const getConversation = async (request, response) => {
  try {
    const conversation = await Conversation.findById(request.params.id)
      .populate({
        path: 'users',
        // populate: {
        //   path: 'videoFileName',
        // },
      })
      .populate({
        path: 'userMedias',
        // populate: {
        //   path: 'videoFileName',
        // },
      })
      .populate({
        path: 'userScripts',
      });

    response.status(200).json({
      conversation,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllConversations = async (request, response) => {
  try {
    const allConversations = await Conversation.find();
    response.status(200).json({
      allConversations,
    });
  } catch (error) {
    console.log(error);
  }
};

// export const getConversations = async(request, response) => {
//   try{
//     // user idを使ってarrayをとってくる感じよ。
//     const
//   } catch(error){
//     console.log(error)
//   }
// }

// 会話が始まった時点で、genreをもう入れるべき。
// export const updateConversationDurationAndGenre = async (request, response) => {
//   try {
//     const { duration, genre } = request.body;
//     const conversation = await Conversation.findById(request.params.id);
//     if (!conversation.duration) {
//       conversation.duration = duration;
//     }
//     if (!conversation.genre.length) {
//       conversation.genre = genre;
//     }
//     await conversation.save();
//     response.status(200).json({
//       conversation,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
