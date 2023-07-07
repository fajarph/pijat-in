import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

const Mail = use('Mail')
const randomstring = require('randomstring')

export default class OtpController {
    public async sendOtp({request, response}: HttpContextContract) {
        try {
            const { email } = request.only(['email'])

            // Cek apakah email sudah terdaftar dalam database
            const user = await User.findBy('email', email)

            if (!user) {
            return response.status(404).json({
                status: 404,
                msg: 'Email not found'
            })
            }

            // Generate OTP
            const otp = randomstring.generate({ length: 6, charset: 'numeric' })

            // Simpan OTP ke dalam field otp_code pada user
            user.otp_code = otp
            await user.save()

            // Kirim email OTP
            await Mail.send('emails.otp', { otp }, (message) => {
            message
                .to(email)
                .from('your-email@example.com')
                .subject('OTP Verification')
            })

            return response.status(200).json({
                status: 200,
                msg: 'OTP sent successfully'
            })
        } catch (error) {
            response.status(404).json({
                status: 404,
                msg: "Error"
            })
        }
    }
}
