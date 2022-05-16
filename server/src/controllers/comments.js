import Comment from '../models/comment';
import Conversation from '../models/conversation';
import User from '../models/user';
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

    const conversation = await Conversation.findById(conversationId);
    const { users } = conversation;
    // console.log(users)

    // conversationの二人にmailを送る。
    const sendEmail = async (recipientUserId) => {
      // const message = await Message.create({
      //   sender: userId,
      //   recipient: recipientUserId,
      //   content: content, // commentの内容をそのまま書けばいい。
      //   read: false,
      // });

      const sender = await User.findById(userId);
      const recipient = await User.findById(recipientUserId);

      const mailOptions = {
        to: recipient.email,
        subject: 'You got a comment!',
        html: `<h1>Lampost</h1><p>Hi ${recipient.name}. You got a message from ${sender.name}.</p><br><h3>${content}</h3><br><p>Please follow the link below to check it out!</p><br><a href=${process.env.MAIL_LINK}>${process.env.MAIL_LINK}</a>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    };

    await sendEmail(users[0]._id);
    await sendEmail(users[1]._id);

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
