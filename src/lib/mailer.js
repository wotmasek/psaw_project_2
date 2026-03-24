const nodemailer = require("nodemailer");
const env = require("../config/env");

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth:
        env.smtp.user && env.smtp.user !== "placeholder-user"
          ? { user: env.smtp.user, pass: env.smtp.password }
          : undefined,
    });
  }
  return transporter;
}

async function sendMail({ to, subject, text, html }) {
  const mail = getTransporter();
  return mail.sendMail({
    from: `"${env.smtp.fromName}" <${env.smtp.fromEmail}>`,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendMail };
