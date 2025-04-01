import transporter from "../config/nodemailer.js";

export const sendMail = async (to, subject, text) => {
    const mailOptions = { from: process.env.SENDER_EMAIL, to, subject, text };
    await transporter.sendMail(mailOptions);
};
  