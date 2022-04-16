import ConversationPrivacySetting from '../models/conversationPrivacySetting';
import mongoose from 'mongoose';
import Conversation from '../models/conversation';

export const updateConversationToPublic = async (request, response) => {
  try {
    const { conversationId } = request.params;
    const { userId } = request.params;
    const conversationPrivacySettings = await ConversationPrivacySetting.findMany({
      conversation: conversationId,
    });
    // [{conversation: 11111, user: 11111, isPublishing: false}, {conversation: 11111, user: 22222, isPublishing: false}]
    for (let i = 0; i < conversationPrivacySettings.length; i++) {
      if (conversationPrivacySettings[i].user === mongoose.Types.ObjectId(userId)) {
        conversationPrivacySettings[i].isPublishing = true;
      }
    }
    await conversationPrivacySettings.save();
    if (conversationPrivacySettings[0].isPublishing && conversationPrivacySettings[1].isPublishing) {
      const conversation = await Conversation.findById(conversationId);
      conversation.isPublic = true;
      await conversation.save();
    }
    response.status(200).json({
      message: 'Success',
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateConversationToPrivate = async (request, response) => {
  try {
    const { conversationId } = request.params;
    const { userId } = request.body;
    const conversationPrivacySettings = await ConversationPrivacySetting.find({
      conversation: conversationId,
    });
    console.log(conversationPrivacySettings);
    for (let i = 0; i < conversationPrivacySettings.length; i++) {
      if (JSON.stringify(conversationPrivacySettings[i].user) === JSON.stringify(userId)) {
        console.log('updating!!!');
        conversationPrivacySettings[i].isPublishing = false;
        await conversationPrivacySettings[i].save();
      }
    }
    const conversation = await Conversation.findById(conversationId);
    conversation.isPublic = false;
    await conversation.save();
    response.status(200).json({
      message: 'Success',
    });
  } catch (error) {
    console.log(error);
  }
};
