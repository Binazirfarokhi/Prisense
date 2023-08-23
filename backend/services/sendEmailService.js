
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const e = require("express");
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAIL_GUN_KEY,
});



function sendEmail(to, subject, content) {
  return mg.messages
    .create('sandbox322445e93128411d8d3a921358d67254.mailgun.org', {
      from: "Mailgun Sandbox <postmaster@sandbox322445e93128411d8d3a921358d67254.mailgun.org>",
      to: [to],
      subject: subject,
      html: content
    });
}

function signUpConfirmEmail(email, token) {
  const html = `
    <h1>Thanks for signing up.</h1>
    <p>You need to confirm your email by click: <a href="${process.env.SERVER_HOST}/api/users/confirm-email?token=${token}">Confirm</a></p>
  `;
  return sendEmail(email, 'Sign Up Email Confirm', html);
}

function resetPasswordLinkEmail(email, resetToken) {
  const html = `
    <h1>Reset password link</h1>
    <p>
        You need to click <a href="${process.env.CLIENT_HOST}/reset-password?resetToken=${resetToken}">reset link</a> to reset your password!
    </p>
  `;
  return sendEmail(email, "Reset your password", html)
}

module.exports = {
  signUpConfirmEmail,
  resetPasswordLinkEmail
}