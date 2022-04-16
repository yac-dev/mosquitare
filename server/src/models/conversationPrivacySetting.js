import mongoose from 'mongoose';

const conversationPrivacySettingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Conversation',
  },
  isPublishing: Boolean,
});

const ConversationPrivacySetting = mongoose.model('ConversationPrivacySetting', conversationPrivacySettingSchema);
export default ConversationPrivacySetting;
