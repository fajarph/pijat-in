import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class UserController {

    public async getUser({ response, auth }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const output = await User.query()
                .preload("orders", (query) => {
                    query.select("id", "id_pesanan", "nama_lengkap", "gender", "durasi", "tambahan", "tanggal_pesanan", "harga", "jam")
                })
                .preload("addreses", (query) => {
                    query.select("id", "lokasi", "alamat_lengkap", "detail_tambahan", "map_url")
                })
                .select("id", "nama", "no_telp", "nik", "status", "email", "tanggal_lahir", "tempat_lahir", "image_url", "ktp_url")

            response.status(200).json({
                status: 200,
                user: output
            })
        } catch (error) {
            response.status(401).json({
                status: 401,
                msg : error.message
            })
        }
    }

    public async getUserToken({ response, auth }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()
          
            const user = auth.use("api").user
            const output = await User.query()
                .where("id", user!.id)
                .preload("orders", (query) => {
                    query.select("id", "id_pesanan", "nama_lengkap", "gender", "durasi", "tambahan", "tanggal_pesanan", "harga", "jam")
                })
                .preload("addreses", (query) => {
                    query.select("id", "lokasi", "alamat_lengkap", "detail_tambahan", "map_url")
                })
                .select("id", "nama", "no_telp", "nik", "status", "email", "tanggal_lahir", "tempat_lahir", "image_url", "ktp_url")

            response.status(200).json({
                status: 200,
                user: output
            })
        } catch (error) {
            response.status(401).json({
                status: 401,
                msg : error.message
            })
        }
    }

    public async updateDataDiri({ request, response, params, auth }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const user = await User.find(params.id)

            if (!user) {
                return response.status(401).json({msg: 'User not found' })
            }

            const data = request.only(['ktp_url', 'nik', 'tempat_lahir', 'tanggal_lahir'])

            user.merge(data)

            await user.save()
            
            return response.json({
                status: 200,
                msg: 'Personal Data successfully updated', 
                ktp_url: user.ktp_url,
                nik: user.nik,
                tempat_lahir: user.tempat_lahir,
                tanggal_lahir: user.tanggal_lahir,
            })
        } catch (error) {
            return response.status(401).json({msg: 'An error occurred while updating'})
        }
    }


    public async updateProfileUser({ request, response, params, auth }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const user = await User.find(params.id)

            if (!user) {
                return response.status(401).json({msg: 'User not found' })
            }

            const data = request.only(['email', 'nama', 'no_telp'])

            user.merge(data)

            await user.save()
            
            return response.json({
                status: 200,
                msg: 'User successfully updated', 
                email: user.email,
                nama: user.nama,
                no_telp: user.no_telp 
            })
        } catch (error) {
            return response.status(401).json({msg: 'An error occurred while updating'})
        }
    }
}
