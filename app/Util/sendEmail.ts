import nodemailer from "nodemailer"

const {AUTH_EMAIL, AUTH_PASS} = process.env
let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    auth: {
        user: AUTH_EMAIL,
        pass: AUTH_PASS,
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
        await transporter.sendEmail(mailOptions)
        return 
    } catch (error) {
        throw error
    }
}

module.exports = sendEmail