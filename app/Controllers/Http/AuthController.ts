import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import User from "App/Models/User"
import nodemailer from "nodemailer"

const generateOTP = () => {
    const digits = '0123456789';
    let OTP = '';
  
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
  
    return OTP;
}

export default class AuthController {

    public async login({ request, auth }: HttpContextContract) {
        try {
            const email = request.input("email")
            const password = request.input("password")

            const token = await auth.use("api").attempt(email, password, {
                expiresIn: "1 days",
            })
    
            const user = await User.findByOrFail("email", email)
    
            return {
                status: 200,
                token: token.token,
                nama: user.nama,
                email: user.email,
                image_url: user.image_url,
            }
        } catch (error) {
            return {
                status: 404,
                message: "email atau password anda salah",
            }
        }
    }

    public async register({ request, auth }: HttpContextContract) {
        try {
            const nama = request.input("nama")
            const no_telp = request.input("no_telp")
            const email = request.input("email")
            const password = request.input("password")

            const newUser = new User()

            newUser.nama = nama
            newUser.no_telp = no_telp
            newUser.email = email
            newUser.password = password

            await newUser.save()

            const otp = generateOTP()

            newUser.otp = otp
            await newUser.save()

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.SMTP_USERNAME,
                to: newUser.email,
                subject: 'Kode OTP Registrasi',
                html: `<p>Kode OTP Anda adalah: ${otp}</p>`,
            };

            await transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email berhasil dikirim : ' + info.response);
                }
            });

            const token = await auth.use("api").login(newUser, {
                expiresIn: "1 days",
            })

            return {
                status: 200,
                token: token.token,
                message: "Register berhasil"
            }
        } catch (error) {
            return {
                status: 404,
                message: error.message,
            }
        }
    }

    public async ibnu({ auth }: HttpContextContract) {
        await auth.use("api").authenticate()
        return { data: 'data berhasil diambil' }
    }
}