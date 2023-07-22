import nodemailer from "nodemailer"

const {SMTP_EMAIL, SMTP_PASS} = process.env
let transporter = nodemailer.createTransport({
    service: "outlook",
    port: 465,
    secure: false,
    auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASS,
    }
})

transporter.verify((error, succes) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Ready for messages");
        console.log(succes);
    }
})

const sendEmail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions)
        return 
    } catch (error) {
        throw error
    }
}

module.exports = sendEmail