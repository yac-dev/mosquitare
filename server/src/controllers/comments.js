import Comment from '../models/comment';
import nodemailer from 'nodemailer';
import Message from '../models/message';
import mongoose from 'mongoose';

const transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const createComment = async (request, response) => {
  try {
    const { conversationId, userId } = request.params;
    const { content } = request.body;
    console.log(content);
    let comment = await new Comment();
    comment.content = content;
    comment.conversation = conversationId;
    comment.user = userId;
    await comment.save();
    comment = await comment.populate({ path: 'user', select: '_id name flagPics', model: 'User' }); // client側でcreateした後にもpopulateする方法。

    // もう疲れた。いいやここは。
    // const { senderId, recipientId } = request.params;
    // console.log(senderId, recipientId);
    // console.log(request.body.content);
    // const message = await Message.create({
    //   sender: senderId,
    //   recipient: recipientId,
    //   content: request.body.content,
    //   read: false,
    // });

    // const sender = await User.findById(senderId);
    // const recipient = await User.findById(recipientId);

    // const mailOptions = {
    //   to: recipient.email,
    //   subject: 'You got a message!',
    //   html: `<h1>Lampost</h1><p>Hi ${recipient.name}. You got a message from ${sender.name}.</p><p>Please follow the link below to check it out!</p><br><a href=${process.env.MAIL_LINK}>${process.env.MAIL_LINK}</a>`,
    // };

    // console.log(recipient.email);

    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log('Email sent: ' + info.response);
    //   }
    // });

    response.status(201).json({
      comment,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getConversationComments = async (request, response) => {
  try {
    const { conversationId } = request.params;
    console.log('searching', conversationId);
    const comments = await Comment.find({ conversation: mongoose.Types.ObjectId(conversationId) }).populate({
      path: 'user',
      select: '_id name photo',
      model: 'User',
    });

    response.status(200).json({
      comments,
    });
  } catch (error) {
    console.log(error);
  }
};

export const aggregateAllComments = async (request, response) => {
  try {
    console.log('aggregating comments');
    const allCommentsStat = await Comment.aggregate([
      {
        $group: {
          _id: '$conversation',
          nums: { $sum: 1 },
        },
      },
    ]);
    response.status(200).json({
      allCommentsStat,
    });
  } catch (error) {
    console.log(error);
  }
};
