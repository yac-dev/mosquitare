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

export const getConversation = async (request, response) => {
  try {
    const conversation = await Conversation.findById(request.params.id)
      .populate({
        path: 'calledUserMedia',
        populate: {
          path: 'videoFileName',
        },
      })
      .populate({
        path: 'recievedUserMedia',
        populate: {
          path: 'videoFileName',
        },
      });

    response.status(200).json({
      conversation,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateConversationDurationAndGenre = async (request, response) => {
  try {
    const { duration, genre } = request.body;
    const conversation = await Conversation.findById(request.params.id);
    conversation.duration = duration;
    conversation.genre = genre;
    await conversation.save();
    response.status(200).json({
      conversation,
    });
  } catch (error) {
    console.log(error);
  }
};
