const ResetPasswordEmail = (name, link) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
  <h2 style="color: #4CAF50; text-align: center;">Password Reset Request</h2>
  <p style="color: #333;">Hi ${name},</p>
  <p style="color: #333;">You requested to reset your password. Please click the button below to set a new password:</p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${link}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Reset Password</a>
  </div>
  <p style="color: #333;">If you did not request a password reset, please ignore this email.</p>
  <p style="color: #333;">This link will expire in 5 minutes for your security.</p>
  <p style="text-align: center; color: #333;">Thank you,</p>
  <p style="text-align: center; font-weight: bold; color: #4CAF50;">TrueCare Access</p>
</div>
    `;
};

export default ResetPasswordEmail;
