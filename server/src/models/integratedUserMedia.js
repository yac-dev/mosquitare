// import mongoose from 'mongoose';

// const integratedUserMediaSchema = new mongoose.Schema({
//   calledUserMedia: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'UserMedia',
//   },
//   calledUserScript: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'UserScript',
//   },
//   recievedUserMedia: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'UserMedia',
//   },
//   recievedUserScript: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'UserScript',
//   },
//   // comments: [], //ここはone to manyか。commentsっていうmodel作って、そっちでrefですればいいや。
//   // もしかしたら、ここはarrayに返るかも。groupチャット用の時も考えて。
//   // → chat 送信用のmodelも作らないといけない。one to manyでconversationかintegratedの方とrelationchipを実装する方向性になるだろう。
//   isPublic: Boolean,
//   createdAt: {
//     type: Date,
//     default: Date.now(),
//   },
// });

// integratedUserMediaSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'calledUserMedia',
//   });
//   this.populate({
//     path: 'recievedUserMedia',
//   });

//   next();
// });

// const IntegratedUserMedia = mongoose.model('IntegratedUserMedia', integratedUserMediaSchema);
// export default IntegratedUserMedia;
