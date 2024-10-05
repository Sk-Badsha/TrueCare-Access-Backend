function registrationSuccessEmail(userName) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Successful</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; color: #333333;">
  
      <div style="width: 100%; padding: 20px; text-align: center;">
        <div style="background-color: #ffffff; margin: 0 auto; padding: 20px; border-radius: 8px; max-width: 600px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #4CAF50; font-size: 24px;">Registration Successful!</h1>
          
          <p style="font-size: 16px; line-height: 1.5;">Hi ${userName},</p>
          
          <p style="font-size: 16px; line-height: 1.5;">
            Thank you for registering at <b><i>TrueCare Access</i></b>. Your account has been successfully created.
            You can now log in and start exploring our features.
          </p>
          
          <a href="http://localhost:5173/login" style="background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 16px; display: inline-block; margin-top: 20px;">Log In</a>
          
          <p style="font-size: 16px; line-height: 1.5; margin-top: 20px;">If you have any questions, feel free to contact our support team.</p>
          
          <div class="footer" style="margin-top: 30px; font-size: 12px; color: #777777;">
            <p>Thank you,<br><strong>TrueCare Access Team</strong></p>
          </div>
        </div>
      </div>
  
    </body>
    </html>
    `;
}

export default registrationSuccessEmail;
