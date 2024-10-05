function PrankEmail(name) {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Important: Your Account Has Been Hacked!</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
      color: #333333;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      margin: 0 auto;
    }
    h1 {
      color: #d9534f;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
    }
    .btn {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #d9534f;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
    }
    .btn:hover {
      background-color: #c9302c;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Oh No! Your Account Has Been Hacked!</h1>
    <p>Dear <strong>${name}</strong>,</p>
    <p>We regret to inform you that your account has been hacked by a team of elite hackers (and by "elite," we mean people who just know your favorite food).</p>
    <p>They have taken full control of your account and are currently browsing through your embarrassing childhood photos. It’s only a matter of time before they find those *questionable* selfies!</p>
    
    <p>But don’t worry, you can stop them right now by clicking the button below:</p>
    
    <a href="http://notarealwebsite.com" class="btn">Stop The Hack Now!</a>
    
    <p>Just kidding! Your account is totally safe 😄. This is just a friendly prank from <strong><img src="https://picsbed.top/file/jAFr%2B%2FhrwFj09IZdYTzOHIllTK7CrF2F5QLxPguzQM0%3D" alt="Hacker......"> Taufick Hacker</strong> (your best buddy). You’ve been fooled!</p>
    
    <p>But hey, you should probably change your password… just in case 👀.</p>

    <p>Best regards,</p>
    <p>The Totally Not Hackers Team</p>
  </div>
</body>
</html>

    `;
}

export default PrankEmail;
