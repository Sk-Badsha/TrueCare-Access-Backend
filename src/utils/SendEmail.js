import nodemailer from "nodemailer";
import { google } from "googleapis";
import { ApiError } from "../utils/ApiError.js";

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    oAuth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN_OAUTH,
    });
    const access_token = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN_OAUTH,
        accessToken: access_token,
      },
    });

    const mailOptions = {
      from: `TrueCare Access 📧 hackerteam@gmail.com `,
      to: to,
      subject: subject,

      html: htmlContent,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
