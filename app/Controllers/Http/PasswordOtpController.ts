import User from "App/Models/User"
const { sendOTP, verifyOTP, deleteOTP } = require("../Http/OtpController")
const { hashData } = require("../../Util/hashData")

const resetUserPassword = async (email, otp, newPassord) => {
    try {
        const validOTP = await verifyOTP({email, otp})

        if (!validOTP) {
            throw Error("Invalid code passed. Check your inbox.")
        }

        if (newPassord.lenght < 8) {
            throw Error("Password is to short!")
        }

        const hashedNewPassword = await hashData(newPassord)
        await User.query().where('email', email).update({ email, password: hashedNewPassword });
        await deleteOTP(email)
    } catch (error) {
        throw Error
    }
}

const sendPasswordResetOTPEmail = async (email) => {
    try {
        const existingUser = await User.findBy("email", email)

        if (!existingUser) {
            throw Error("There's no account for the provided email")
        }

        if (!existingUser.verified) {
            throw Error("Email hasn't been verified yet. Check your inbox")
        }

        const otpDetails = {
            email,
            subject: "Password Reset",
            message: "Enter the code below to reset your password.",
            duration: 1,
        }
        const createOTP = await sendOTP(otpDetails)
        return createOTP
    } catch (error) {
        throw error
    }
}

module.exports = { sendPasswordResetOTPEmail, resetUserPassword }
