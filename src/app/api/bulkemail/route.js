import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const {
      subject,
      body,
      title,
      greeting,
      bestRegards,
      recipient_email,
      emailService,
      sender_email,
      password,
      name,
    } = await request.json();

    var transporter = nodemailer.createTransport({
      service: emailService,
      auth: {
        user: sender_email,
        pass: password,
      },
    });

    const mailOption = {
      from: `"${name}" ${sender_email}`,
      to: recipient_email,
      subject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <body>
        <p>${greeting}</p>
        <p>${title}</p>
        <div>${body}</div>
        <p>${bestRegards}</p>
        </body>
        
        </html>
        
        `,
    };

    await transporter.sendMail(mailOption);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to send email' },
      { status: 500 }
    );
  }
}
