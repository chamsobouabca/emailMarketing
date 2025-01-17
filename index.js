const fs = require('fs').promises;
const path = require('path');
const { sendMail } = require('./senMail');

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
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: Roboto, sans-serif;">
    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: white; border-radius: 10px; margin: 20px auto; padding: 10px;">
        <tr>
            <td>
                <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="padding: 10px; width: 15%;">
                            <img src="https://i.postimg.cc/FFSgdbv6/hotyverse.png" alt="hotyverse-logo-image" style="width: 50px; height: auto;">
                        </td>
                        <td style="width: 55%;">
                            <span style="font-size: 20px; font-weight: 800; letter-spacing: 0.35rem;">HotyVerse</span>
                        </td>
                        <td style="width: 30%; text-align: right;">
                            <img src="https://i.postimg.cc/tJ3TSWJ6/email.png" alt="splash-image" style="width: 150px; height: auto;">
                        </td>
                    </tr>
                </table>
                <h1 style="font-weight: bold; font-size: 24px; margin: 0; text-align: left; padding: 10px;">Bienvenue A HotyVerse</h1>
            </td>
        </tr>
        <tr>
            <td>
                <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="padding: 10px;">
                            <h6 style="font-size: 16px; font-weight: 800; margin: 0;">Cher Propriétaire de l'hôtel,</h6>
                            <p style="line-height: 1.7rem; margin: 10px 0;">
                                Nous avons le plaisir de vous inviter à tester notre nouvelle application SaaS de gestion hôtelière.
                                Cette solution a été spécialement conçue pour améliorer l'efficacité et la simplicité de la gestion de votre établissement.
                                <br><br>
                                Actuellement, l'application est en phase de test, ce qui signifie que toute donnée saisie sera supprimée ultérieurement. Cette période de test est une opportunité pour nous d'améliorer l'application grâce à vos précieux retours et suggestions.
                                <br><br>
                                Nous vous serions reconnaissants si vous pouviez prendre un moment pour explorer les fonctionnalités de l'application et partager vos impressions avec nous. Votre expertise et votre avis seront déterminants pour nous aider à finaliser une solution qui répond au mieux à vos besoins.
                                <br><br>
                                Merci d'avance pour votre participation et votre soutien.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px;">
                            <a href="http://104.154.75.47/" style="text-decoration: none; background-color: #C6DDFF;border-radius: 7px; color: black; display: inline-block; font-size: 16px; font-weight: 600; height: 3.5rem; line-height: 3.5rem; text-align: center; width: 70%;">Commencer</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px;">
                            <p style="color: rgba(63, 63, 63, 0.66); margin: 0; text-align: center;">"Qui sommes-nous? Vous pouvez consulter notre site web pour voir ce qui est disponible pour vous:</p>
                            <p style="text-align: center; margin-top: 10px;">
                                <a href="https://cloudy-verse.vercel.app/" style="text-decoration: none; font-size: 16px; font-weight: 600; color: navy;">Cloudy Verse</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table cellpadding="0" cellspacing="0" width="100%" style="padding: 20px; text-align: center;">
                    <tr>
                        <td>
                            <a href="#" style="margin: 0 15px;">
                                <img src="https://i.postimg.cc/Fs5XPHYV/facebookpng.png" alt="Facebook" style="width: 50px; height: 50px;">
                            </a>
                            <a href="https://x.com/cloudyversedz" style="margin: 0 15px;">
                                <img src="https://i.postimg.cc/cLTq47XF/twitter.png" alt="Twitter" style="width: 50px; height: 50px;">
                            </a>
                            <a href="https://www.instagram.com/cloudyverse_dz/" style="margin: 0 15px;">
                                <img src="https://i.postimg.cc/HswDF15D/instagram.png" alt="Instagram" style="width: 50px; height: 50px;">
                            </a>
                            <a href="https://www.linkedin.com/in/cloudy-verse-024062347" style="margin: 0 15px;">
                                <img src="https://i.postimg.cc/9Qc5hgt4/linkedIn.png" alt="LinkedIn" style="width: 50px; height: 50px;">
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    const result = await processEmailList(
      path.join(__dirname, 'emails.txt'),
      'Bienvenue A HotyVerse',
      'Invitation to test our new hotel management SaaS application',
      htmlTemplate
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