import nodemailer from 'nodemailer';
import express, { Request, Response } from 'express';
const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_E,
        pass: process.env.NODEMAILER_P,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.NODEMAILER_E,
      subject: 'New Contact Form Submission - mindFull',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: 'Form Submitted Successfully' });
  } catch (error) {
    console.log('Error submitting form', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;
