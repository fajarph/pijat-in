import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Order from "App/Models/Order";

export default class OrderController {

    public async getOrder({ response, auth }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const output = await Order.query().select("nama_lengkap", "gender", "durasi", "tambahan", "user_id")

            response.status(200).json({
                status: 200,
                order: output
            })
        } catch (error) {
            response.status(404).json({
                status: 404,
                msg: "Autentikasi gagal"
            })
        }
    }

    public async createOrder({ request, response, auth} : HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const user = auth.use('api').user
            const { nama_lengkap, gender, durasi, tambahan } = request.all()

            const generateRandomValue = (length) => {
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
                let result = ''
          
                for (let i = 0; i < length; i++) {
                  const randomIndex = Math.floor(Math.random() * characters.length)
                  result += characters.charAt(randomIndex)
                }
          
                return result
              }

            const newOrder = new Order()
            newOrder.fill({
                nama_lengkap,
                gender,
                durasi,
                tambahan,
                user_id: user?.id,
                id: generateRandomValue(5)
            })

            await newOrder.save()

            response.status(200).json({
                status: 200,
                msg: "Selamat Menikmati",
                order: newOrder,
            })
        } catch (error) {
            response.status(404).json({
                status: 404,
                msg: "Autentikasi gagal"
            })
        }
    }
}
