export const emailVerificationTamplete = (link) => {
    return `
      <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f2f2f2; color: #333;">
        <div style="width: 100%; margin: 0 auto; padding: 20px; background-color: #fff; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #007BFF;">Email Verification</h1>
            <p>Thank you for signing up! Please go to this link and comfirm email.</p>
            <p style="text-align: start;">
                <a href='${link}' style="display: inline-block; background-color: #007BFF; color: #fff; padding: 10px 20px; border-radius: 4px; text-decoration: none; margin-right: 10px">Click On It</a>
            </p>
        </div>
      </body>
      
      `;
  };
  


  export const forgetPasswordTamplete = (code) => {
    return `
      <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f2f2f2; color: #333;">
        <div style="width: 100%; margin: 0 auto; padding: 20px; background-color: #fff; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #007BFF;">Email Verification</h1>
            <p>Thank you for signing up! Please go to this link and comfirm email.</p>
            <p style="text-align: start;">
                <p style="display: inline-block; background-color: #007BFF; color: #fff; padding: 10px 20px; border-radius: 4px; text-decoration: none; margin-right: 10px">${code}</p>
            </p>
        </div>
      </body>
      
      `;
  };
  