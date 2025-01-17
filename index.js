

const fs = require('fs').promises;
const path = require('path');
const { sendMail } = require('./senMail'); // Assuming the previous script is saved as emailSender.js

async function processEmailList(filePath, subject, text, html) {
  try {
    // Read the file
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Split the content into lines and process
    const rawEmails = fileContent.split('\n')
      .map(email => email.trim()) // Remove whitespace
      .filter(email => email !== ''); // Remove empty lines

    // Remove duplicates
    const uniqueEmails = [...new Set(rawEmails)];

    // Validate emails
    const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = uniqueEmails.filter(email => validEmailRegex.test(email));

    // Invalid emails
    const invalidEmails = uniqueEmails.filter(email => !validEmailRegex.test(email));

    // Arrays to track send results
    const successEmails = [];
    const failedEmails = [];

    // Send emails
    for (const email of validEmails) {
      try {
        await sendMail(email, subject, text, html);
        successEmails.push(email);
        console.log(`Email sent successfully to ${email}`);
      } catch (error) {
        failedEmails.push(email);
        console.error(`Failed to send email to ${email}:`, error.message);
      }
    }

    // Return results
    return {
      totalEmails: validEmails.length,
      successEmails,
      failedEmails,
      invalidEmails
    };
  } catch (error) {
    console.error('Error processing email list:', error);
    throw error;
  }
}

// Example usage
async function main() {
  try {
    const result = await processEmailList(
      path.join(__dirname, 'emails.txt'), // Path to your email list file
      'Test Subject',
      'This is a test email',
    );

    console.log('Email Sending Results:');
    console.log('Total Emails:', result.totalEmails);
    console.log('Successfully Sent:', result.successEmails);
    console.log('Failed Emails:', result.failedEmails);
    console.log('Invalid Emails:', result.invalidEmails);
  } catch (error) {
    console.error('Script execution failed:', error);
  }
}


 main();

