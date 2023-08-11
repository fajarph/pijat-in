import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Order from "App/Models/Order";
import OrderHistory from "App/Models/OrderHistory";

const generateRandomValue = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
  
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        result += characters.charAt(randomIndex)
    }
  
    return result
}

export default class OrderController {

    public async getOrder({ response, auth }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const output = await Order.query()
                .preload("order_histories", (query) => {
                    query.select("status_sebelumnya", "order_id", "created_history")
                })
                .select("id", "id_pesanan", "nama_lengkap", "gender", "status", "durasi", "tambahan", "tanggal_pesanan", "harga", "jam", "user_id")

            response.status(200).json({
                status: 200,
                order: output
            })
        } catch (error) {
            response.status(404).json({
                status: 404,
                msg: error.message
            })
        }
    }

    public async createOrder({ request, response, auth} : HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const user = auth.use('api').user
            const { nama_lengkap, gender, durasi, tambahan, tanggal_pesanan, harga, jam } = request.all()

            const newOrder = new Order()
            newOrder.fill({
                id_pesanan: generateRandomValue(7),
                nama_lengkap,
                gender,
                durasi,
                tambahan,
                tanggal_pesanan,
                harga,
                jam,
                user_id: user?.id
            })

            await newOrder.save()

            const orderHistory = new OrderHistory()
            orderHistory.fill({
                order_id: newOrder.id,
                created_history: newOrder.createdAt
            });

            await orderHistory.save()

            response.status(200).json({
                status: 200,
                msg: "Order created successfully",
                order: newOrder,
                history: orderHistory
            })

            console.log(orderHistory);
            
        } catch (error) {
            response.status(404).json({
                status: 404,
                msg: error.message
            })
        }
    }

    public async getOrderHistory({ response, auth }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const orderHistories = await OrderHistory.query().select("*");

            response.status(200).json({
                status: 200,
                orderHistories: orderHistories,
            });
        } catch (error) {
            response.status(404).json({
                status: 404,
                msg: error.message,
            });
        }
    }
}
