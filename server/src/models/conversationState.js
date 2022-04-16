import mongoose from 'mongoose';

const conversationStateSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Conversation',
  },
  state: [Boolean],
  state: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
});

const ConversationState = mongoose.model('ConversationState', conversationStateSchema);

export default ConversationState;
