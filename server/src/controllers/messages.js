import nodemailer from 'nodemailer';
import Message from '../models/message';
import User from '../models/user';
import mongoose from 'mongoose';

const transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const createMessage = async (request, response) => {
  try {
    const { senderId, recipientId } = request.params;
    const message = await Message.create({
      sender: senderId,
      recipient: recipientId,
      content: request.body.content,
      read: false,
    });

    console.log(senderId, recipientId);
    console.log(request.body.content);

    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    const mailOptions = {
      to: recipient.email,
      from: 'lamposttech@gmail.com',
      subject: 'You got a message!',
      html: `<h1>Lampost</h1><p>Hi ${recipient.name}. You got a message from ${sender.name}.</p><p>Please follow the link below to check it out!</p><br><a href=${process.env.MAIL_LINK}>${process.env.MAIL_LINK}</a>`,
    };

    console.log(recipient.email);

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    response.status(201).json({
      message,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMyMessages = async (request, response) => {
  try {
    const messages = await Message.find({
      // recipient: mongoose.Types.ObjectId(request.body.userId),
      recipient: request.body.userId,
      // read: false,
    }).populate({
      path: 'sender',
    });
    response.status(200).json({
      messages,
    });
  } catch (error) {}
};

export const updateUnreadToRead = async (request, response) => {
  try {
    const { messageIds } = request.body;
    const messages = await Message.find({ _id: { $in: messageIds } });
    messages.forEach(async (message) => {
      message.read = true;
      await message.save();
    });
    response.status(200).json({
      message: 'success',
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMessagesWithUser = async (request, response) => {
  try {
    const { userId, myId } = request.body;
    const messagesBySender = await Message.find({ sender: userId, recipient: myId })
      .populate({
        path: 'sender',
      })
      .populate({
        path: 'recipient',
      });
    const messagesByMe = await Message.find({ sender: myId, recipient: userId })
      .populate({
        path: 'sender',
      })
      .populate({
        path: 'recipient',
      });
    const allMessages = [...messagesBySender, ...messagesByMe];
    response.status(200).json({
      allMessages,
    });
  } catch (error) {
    console.log(error);
  }
};
