import User from "App/Models/User"
const bcrypt = require("bcrypt")
const generateOTP = require("App/Util/generateOtp")
const sendEmail = require("App/Util/sendEmail")
const { SMTP_EMAIL } = process.env

const hashData = async (data, saltRounds = 10) => {
    try {
        const hashedData = await bcrypt.hash(data, saltRounds)
        return hashedData
    } catch (error) {
        throw error
    }
}

const verifyHashedData = async (unhashed, hashed) => {
    try {
        const match = await bcrypt.compare(unhashed, hashed)
        return match
    } catch (error) {
        throw error
    }
}

const verifyOTP = async ({email, otp}) => {
    try {
        console.log('email:', email);
        if (!(email && otp)) {
            throw Error("Provide values for email, otp")
        }

        const matchedOTPRecord = await User.findBy("email", email)
        console.log('Matched OTP Record:', matchedOTPRecord);

        if (!matchedOTPRecord) {
            throw Error("No otp record found.")
        }

        const  { expires } = matchedOTPRecord

        if (expires && expires.getTime() < Date.now()) {
            const user = await User.findBy("email", email);
            user && await user.delete();
            throw new Error("Code has expired. Request for a new one.");
        }

        const hashedOTP = matchedOTPRecord.otp;
        const validOTP = await verifyHashedData(otp, hashedOTP);
        return validOTP;
    } catch (error) {
        throw error
    }
}
    
const sendOTP = async ({nama, no_telp, password, email, subject, message, duration = 1 }) => {
    try {
        if (!( nama && email && subject && message)) {
            throw Error("Provide values for email, subject, message")
        }

        await User.query().where('email', email).delete();

        const generatedOTP = await generateOTP()

        const mailOptions = {
            from: SMTP_EMAIL,
            to: email,
            subject,
            html: `<p>${message}</p><p style="color:tomato;
            font-size:25px;letter-spacing:2px;"><b>
            ${generatedOTP}</b></p><p>This Code <b>expires in ${duration} hour(s)</b>.</p>`
        }
        await sendEmail(mailOptions)

        const hashedOTP = await hashData(generatedOTP)
        const newOTP = new User()
        newOTP.nama = nama
        newOTP.no_telp = no_telp
        newOTP.email = email
        newOTP.password = password
        newOTP.otp = hashedOTP
        newOTP.created = new Date() 
        newOTP.expires = new Date(Date.now() + 3600000 * +duration)

        const createdOTPRecord = await newOTP.save()
        return createdOTPRecord
    } catch (error) {
        throw error
    }
}

const deleteOTP = async (email) => {
    try {
        const user = await User.findByOrFail("email", email);
        await user.delete()
    } catch (error) {
        throw error
    }
}

module.exports = { sendOTP, verifyOTP, deleteOTP } 
