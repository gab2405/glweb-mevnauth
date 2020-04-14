const nodemailer = require('nodemailer');
const confirmTemplate = require('../mailtemplates/confirm')
const resetTemplate = require('../mailtemplates/reset')
const inviteTemplate = require('../mailtemplates/invite')

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 25,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});


module.exports = {
    sendConfirm: async (id) => {
        sender = 'accounts@gl-webentwicklung.de';
        recepient = 'accounts@gl-webentwicklung.de';
        var mailOptions = {
            from: sender,
            to: recepient,
            subject: 'Please confirm your subscrition',
            html: confirmTemplate.htmlTemplate(id)
        };
        await transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            res.status(200).json({
                'Msg': 'Message sent'
            });
        });
        return true;
    },
    sendReset: async (email, tk) => {
        sender = process.env.EMAIL_SENDER;
        recepient = email;
        var mailOptions = {
            from: sender,
            to: recepient,
            subject: 'Reset your password',
            html: resetTemplate.htmlTemplate(tk)
        };
        await transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            res.status(200).json({
                'Msg': 'Message sent'
            });
        });
        return true;
    },
    sendInvitation: async (id, email) => {
        sender = process.env.EMAIL_SENDER;
        recepient = email;
        var mailOptions = {
            from: sender,
            to: recepient,
            subject: 'You are invited to join',
            html: inviteTemplate.htmlTemplate(id)
        };
        await transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            res.status(200).json({
                'Msg': 'Message sent'
            });
        });
        return true;
    }
}