function JobOpeningEmail(
  companyName,
  openingFor,
  whomToContactName,
  whomToContactProfileUrl,
  applyLink
) {
  return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #4CAF50;">New Job Opening</h2>
        <p>Dear Candidate,</p>
        <p>We are excited to share a new job opening:</p>
  
        <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Company Name:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${companyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Opening For:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${openingFor}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Whom to Contact:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">
            <a href="${whomToContactProfileUrl}" target="_blank" style="color: #4CAF50;">${whomToContactName}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Link to Apply:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">
              <a href="${applyLink}" target="_blank" style="color: #4CAF50;">
      ${applyLink}
    </a>
            </td>
          </tr>
        </table>
  
        <p>If you are interested, please contact the mentioned person or apply directly using the link provided.</p>
  
        <p>Best regards,</p>
        <p>Your Company Name</p>
      </div>
    `;
}

export default JobOpeningEmail;
