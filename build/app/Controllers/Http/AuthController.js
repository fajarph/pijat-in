"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
class AuthController {
    async login({ request, auth }) {
        try {
            const email = request.input("email");
            const password = request.input("password");
            const token = await auth.use("api").attempt(email, password, {
                expiresIn: "1 days",
            });
            const user = await User_1.default.findByOrFail("email", email);
            return {
                status: 200,
                token: token.token,
                nama: user.nama,
                email: user.email,
                image_url: user.image_url,
            };
        }
        catch (error) {
            return {
                status: 404,
                message: "email atau password anda salah",
            };
        }
    }
    async register({ request, auth }) {
        try {
            const nama = request.input("nama");
            const no_telp = request.input("no_telp");
            const email = request.input("email");
            const password = request.input("password");
            const newUser = new User_1.default();
            newUser.nama = nama;
            newUser.no_telp = no_telp;
            newUser.email = email;
            newUser.password = password;
            await newUser.save();
            const token = await auth.use("api").login(newUser, {
                expiresIn: "1 days",
            });
            return {
                status: 200,
                token: token.token,
                message: "Register berhasil"
            };
        }
        catch (error) {
            return {
                status: 404,
                message: error.message,
            };
        }
    }
    async ibnu({ auth }) {
        await auth.use("api").authenticate();
        return { data: 'data berhasil diambil' };
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map