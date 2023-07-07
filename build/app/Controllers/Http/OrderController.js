"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Order_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Order"));
class OrderController {
    async getOrder({ response, auth }) {
        try {
            await auth.use("api").authenticate();
            const output = await Order_1.default.query().select("nama_lengkap", "gender", "durasi", "tambahan", "user_id");
            response.status(200).json(output);
        }
        catch (error) {
            response.status(404).json({
                status: 404,
                msg: "Autentikasi gagal"
            });
        }
    }
    async createOrder({ request, response, auth }) {
        try {
            await auth.use("api").authenticate();
            const user = auth.use('api').user;
            const { nama_lengkap, gender, durasi, tambahan } = request.all();
            const newOrder = new Order_1.default();
            newOrder.fill({
                nama_lengkap,
                gender,
                durasi,
                tambahan,
                user_id: user?.id
            });
            await newOrder.save();
            response.status(200).json({
                status: 200,
                msg: "Selamat Menikmati",
                order: newOrder
            });
        }
        catch (error) {
            response.status(404).json({
                status: 404,
                msg: "Autentikasi gagal"
            });
        }
    }
}
exports.default = OrderController;
//# sourceMappingURL=OrderController.js.map