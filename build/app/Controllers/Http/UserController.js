"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
class UserController {
    async getUser({ response, auth }) {
        try {
            await auth.use("api").authenticate();
            const output = await User_1.default.query()
                .preload("orders", (query) => {
                query.select("nama_lengkap", "gender", "durasi", "tambahan");
            })
                .select("id", "nama", "no_telp", "nik", "status", "email", "tanggal_lahir", "tempat_lahir", "image_url");
            response.status(200).json({
                status: 200,
                user: output
            });
        }
        catch (error) {
            response.status(401).json({
                status: 401,
                msg: "Autentikasi gagal"
            });
        }
    }
    async getUserToken({ response, auth }) {
        try {
            await auth.use("api").authenticate();
            const user = auth.use("api").user;
            const output = await User_1.default.query()
                .where("id", user.id)
                .preload("orders", (query) => {
                query
                    .select("nama_lengkap", "gender", "durasi", "tambahan");
            });
            response.status(200).json(output);
        }
        catch (error) {
            response.status(401).json({
                status: 401,
                msg: "Autentikasi gagal"
            });
        }
    }
    async update({ request, response, params }) {
        try {
            const user = await User_1.default.find(params.id);
            if (!user) {
                return response.status(401).json({ msg: 'Pengguna tidak ditemukan' });
            }
            const data = request.only(['name', 'nik', 'tempat_lahir', 'tanggal_lahir', 'image_url']);
            user.merge(data);
            await user.save();
            return response.json({ msg: 'Pengguna berhasil diupdate', data: user });
        }
        catch (error) {
            return response.status(401).json({ msg: 'Terjadi kesalahan saat melakukan update' });
        }
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map