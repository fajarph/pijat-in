import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import User from "App/Models/User"
import Mail from "@ioc:Adonis/Addons/Mail"

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

            await Mail.send((message) => {
                message
                    .to(newUser.email)
                    .from('fajar270304@gmail.com')
                    .subject('Kode OTP Registrasi')
                    .html(`<h3>Kode OTP Anda adalah: ${otp}</h3>`)
            })

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