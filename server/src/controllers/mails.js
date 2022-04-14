import nodemailer from 'nodemailer';
import Mail from '../models/mail';
import User from '../models/user';

const transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const createMail = async (request, response) => {
  try {
    const { senderId, recipientId } = request.params;
    const mail = await Mail.create({
      sender: senderId,
      recipient: recipientId,
      message: request.body.message,
      read: false,
    });

    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    const mailOptions = {
      to: recipient.email,
      subject: 'You got a message from other user!',
      html: `<h1>Lampost</h1><p>Hi ${recipient}. You got a message from ${sender.name}.</p><p>Please follow the link below and send reply!</p><br><a href="${process.env.MAIL_LINK} />`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    response.send(201).json({
      mail,
    });
  } catch (error) {
    console.log(error);
  }
};
