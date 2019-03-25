const sgMail = require('@sendgrid/mail');
const config = require('config/keys');
const tokenService = require('services/token.service');

const resetPasswordTemplate = require('templates/resetPassword.template');
const verifyAccountTemplate = require('templates/verifyAccount.template');

sgMail.setApiKey(config.sendgridApiKey);

exports.sendVerifyAccount = async (user) => {
  const token = await tokenService.create(user._id, 'new-user');
  const emailTemplate = verifyAccountTemplate.html(config.backendUrl, token.token);

  const msg = {
    to: user.email,
    from: 'donotreply@app.com',
    subject: 'HomePokerClub: Verify your account',
    text: 'Please open this email with a browser that accepts html in emails',
    html: emailTemplate
  };

  return sgMail.send(msg);
}

exports.sendResetPassword = async (user) => {
  const token = await tokenService.create(user._id, 'reset-password');
  const emailTemplate = resetPasswordTemplate.html(config.frontendUrl, token.token);

  const msg = {
    to: user.email,
    from: 'donotreply@app.com',
    subject: 'HomePokerClub: Reset password',
    text: 'Please open this email with a browser that accepts html in emails',
    html: emailTemplate
  };

  return sgMail.send(msg);
}