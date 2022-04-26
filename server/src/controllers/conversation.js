import Conversation from '../models/conversation';
// import ConversationState from '../models/conversationState';
import ConversationPrivacySetting from '../models/conversationPrivacySetting';
import User from '../models/user';

export const createConversation = async (request, response) => {
  try {
    console.log(request.body);
    const { userId } = request.body;
    const { genre } = request.body;
    const conversation = await new Conversation();
    conversation.users.push(userId);
    conversation.genre = genre;
    conversation.isPublic = true;
    // const conversationState = await ConversationState.create({
    //   conversation: conversation._id,
    //   state: [true, true],
    // });
    await ConversationPrivacySetting.create({
      user: userId,
      conversation: conversation._id,
      isPublishing: true,
    });
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
    await ConversationPrivacySetting.create({
      user: userId,
      conversation: conversation._id,
      isPublishing: true,
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
      // .populate({
      //   path: 'userMedias',
      //   // populate: {
      //   //   path: 'videoFileName',
      //   // },
      // })
      // .populate({
      //   path: 'userScripts',
      // })
      .populate({
        path: 'comments',
      })
      .populate({
        path: 'likes',
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
    const allConversations = await Conversation.find()
      .populate({
        path: 'users',
        select: 'name photo nationalities',
      })
      .populate({
        path: 'genre',
      });
    // .populate({
    //   path: 'comments',
    // })
    // .populate({
    //   path: 'likes',
    // });
    // .populate('comments');
    // 多分、AllConversation、MyConversationでgoodとかviewをrenderさせたい場合は、これも必要かもね。
    response.status(200).json({
      allConversations,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMyConversations = async (request, response) => {
  try {
    const { conversationIds } = request.body;
    console.log(conversationIds);
    const myConversations = await Conversation.find({ _id: { $in: conversationIds } })
      .populate({
        path: 'users',
        select: 'name photo nationalities',
      })
      .populate({
        path: 'genre',
      });
    response.status(200).json({
      myConversations,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserConversations = async (request, response) => {
  try {
    const user = await User.findById(request.params.userId);
    console.log(user);
    const userConversations = await Conversation.find({ _id: { $in: user.conversations } })
      .populate({
        path: 'users',
        select: 'name photo',
      })
      .populate({
        path: 'genre',
      });
    response.status(200).json({
      userConversations,
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
