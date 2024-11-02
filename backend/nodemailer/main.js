import nodemailer from 'nodemailer';

// Create a transporter object using Gmail's SMTP details
var transport = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: 'smanojsingh073@gmail.com', // Your Gmail address
      pass: 'dzbocgmvdbdzsfmr'     // Your Gmail password or App Password
   }
});

// Define the email message object
var message = {
   from: 'smanojsingh073@gmail.com',
   to: 'manojsinghmanojrajput826@gmail.com', // Recipient's email
   subject: 'Nodemailer Checking',
   text: 'Hello SMTP Email'
};

// Send the email
transport.sendMail(message, function(err, info) {
   if (err) {
      console.log('Error: ', err);
   } else {
      console.log('Email sent: ', info.response);
   }
});
