import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.ethereal.email",
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER || "maddison53@ethereal.email",
        pass: process.env.EMAIL_PASS || "jn7jnAPss4f63QBp6D",
    },
});

const sendEmail = async ({ to, subject, text, html }) => {
    try{
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || ' "LinkUpEvents" <no-reply@linkup.com> ',
            to,
            subject,
            text,
            html,
        });

        console.log(" Message sent: ", info.messageId);
    }
    catch(error){
        console.error("Nodemailer Error: ", error);
    }
};

export { sendEmail };