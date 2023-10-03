import cron from 'node-cron';
import nodemailer from 'nodemailer';
import userModel from '../../DB/model/User.model.js';


const sendReminderEmails = async () => {
    try {
      const users = await userModel.find({ confirmEmail: false });

      const emailSubject = 'Email Confirmation Reminder';
      for (const user of users) {
        const emailBody = `Dear ${user.firstName} ${user.lastName},<br><br>Please don't forget to confirm your email to avoid account deletion.<br><br>Sincerely,<br>Your App Team`;
  
        // Send the email using your email sending service
        await sendEmail({
          to: user.email,
          html: emailBody,
          subject: emailSubject,
        });
  
        console.log(`Reminder email sent to ${user.email}`);
      }
    } catch (error) {
      console.error('Error sending reminder emails:', error);
    }
  };
  // Schedule the function to run every day at 9:00 PM
  cron.schedule('0 21 * * *', () => {
    console.log('Running reminder email task!');
    sendReminderEmails();
  });