import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class UserController {

    public async getUser({ response, auth }: HttpContextContract) {
        try {
            // await auth.use("api").authenticate()

            const user = auth.use("api").user
            const output = await User.query()
                .where("id", user!.id)
                .preload("orders", (query) => {
                    query.select("nama_lengkap", "gender", "durasi", "tambahan")
                })
                .select("id", "nama", "no_telp", "nik", "status", "email", "tanggal_lahir", "tempat_lahir", "image_url")
                .first()

            response.status(200).json({
                status: 200,
                user: output
            })
        } catch (error) {
            response.status(401).json({
                status: 401,
                msg : "Autentikasi gagal"
            })
        }
    }

    public async getUserToken({ response, auth }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()
          
            const user = auth.use("api").user
            const output = await User.query().where("id", user!.id).first()

            response.status(200).json(output)
        } catch (error) {
            response.status(401).json({
                status: 401,
                msg : "Autentikasi gagal"
            })
        }
    }

    public async update({ request, response, params }: HttpContextContract) {
        try {
            const user = await User.find(params.id)

            if (!user) {
                return response.status(401).json({msg: 'Pengguna tidak ditemukan' })
            }

            const data = request.only(['name', 'nik', 'tempat_lahir', 'tanggal_lahir', 'image_url'])

            user.merge(data)

            await user.save()
            
            return response.json({msg: 'Pengguna berhasil diupdate', data: user })
        } catch (error) {
            return response.status(401).json({msg: 'Terjadi kesalahan saat melakukan update'})
        }
    }

    
}
