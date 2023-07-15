// import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User"
const bcrypt = require("bcrypt")
const generateOTP = require("App/Util/generateOtp")
const sendEmail = require("App/Util/sendEmail")
const { AUTH_EMAIL } = process.env

const hashData = async (data, saltRounds = 10) => {
    try {
        const hashedData = await bcrypt.hash(data, saltRounds)
        return hashedData
    } catch (error) {
        
    }
}
    
const sendOtp = async ({ auth, email, subject, message, duration = 1 }) => {
    try {
        await auth.use("api").authenticate()
        
        const user = auth.use("api").user

        if (!(email && subject && message)) {
            throw Error("Provide values for email, subject, message")
        }

        await User.query().where('email', email).delete();

        const generatedOTP = await generateOTP()

        const mailOptions = {
            from: AUTH_EMAIL,
            to: user.email,
            subject,
            html: `<p>${message}</p><p style="color:tomato;
            font-size:25px;letter-spacing:2px;"><b>
            ${generatedOTP}</b></p><p>This Code <b>expires in ${duration}`
        }
        await sendEmail(mailOptions)

        const hashedOTP = await hashData(generatedOTP)
        const newOTP = new User()
        newOTP.email = email
        newOTP.otp = hashedOTP
        newOTP.created = new Date() 
        newOTP.expires = new Date(Date.now() + 3600000 * +duration)

        const createdOTPRecord = await newOTP.save()
        return createdOTPRecord
    } catch (error) {
        throw error
    }
}

module.exports = { sendOtp }
