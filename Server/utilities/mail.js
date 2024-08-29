const nodemailer =  require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for secure connection
    auth: {
      user: "raidtechprogrammers@gmail.com",
      pass: "pplf madv vrwe jekl", // replace with your password or use environment variables
    },
  });
  
  /**
   * Sends an email using Nodemailer.
   * @param {string} contact - Email address of the recipient.
   * @param {Object} message - Message object containing subject and content.
   *                           Should have either 'text' or 'html' property.
   * @returns {Promise<Object>} - Promise resolving to the Nodemailer info object.
   */
  async function sendMail(contact, message) {
    try {
      const info = await transporter.sendMail({
        from: '"RAIDTECH SOFTWARE SOLUTIONS" <raidtechprogrammers@gmail.com>',
        replyTo: "raidtechprogrammers@gmail.com",
        to: contact,
        ...message, // spread the rest of message properties
      });
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
module.exports = sendMail