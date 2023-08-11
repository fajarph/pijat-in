import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import User from "App/Models/User"
const { sendVerificationOTPEmail } = require("../Http/EmailVerifController")

export default class AuthController {

    public async login({ request, auth }: HttpContextContract) {
        try {
            const email = request.input("email")
            const password = request.input("password")

            const token = await auth.use("api").attempt(email, password, {
                expiresIn: "1 days",
            })
    
            const fetchedUser = await User.findBy("email", email)

            if (!fetchedUser) {
                throw Error("Invalid email entered!")
            }

            if (!fetchedUser.verified) {
                throw Error("Email hasn't been verified yet. Check your inbox")
            }

            return {
                status: 200,
                token: token.token,
                nama: fetchedUser.nama,
                email: fetchedUser.email,
                image_url: fetchedUser.image_url,
                verified: fetchedUser.verified
            }
        } catch (error) {
            throw error
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

            const token = await auth.use("api").login(newUser, {
                expiresIn: "1 days",
            })

            await sendVerificationOTPEmail(email)

            return {
                status: 200,
                token: token.token,
                message: "Registration is successful",
                verified: newUser.verified,
                password: newUser.password
            }
        } catch (error) {
            throw error
        }
    }

    public async ibnu({ auth }: HttpContextContract) {
        await auth.use("api").authenticate()
        return { data: 'data berhasil diambil' }
    }
}