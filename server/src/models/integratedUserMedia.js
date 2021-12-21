import mongoose from 'mongoose';

const integratedUserMediaSchema = new mongoose.Schema({
  calledUserMedia: {
    type: mongoose.Schema.ObjectId,
    ref: 'UserMedia',
  },
  recievedUserMedia: {
    type: mongoose.Schema.ObjectId,
    ref: 'UserMedia',
  }, // もしかしたら、ここはarrayに返るかも。groupチャット用の時も考えて。
  // comments: [], //ここはone to manyか。commentsっていうmodel作って、そっちでrefですればいいや。
});

const IntegratedUserMedia = mongoose.model('IntegratedUserMedia', integratedUserMediaSchema);
export default IntegratedUserMedia;
