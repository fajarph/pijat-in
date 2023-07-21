import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Address from "App/Models/Address";

export default class AddressController {

    public async createAddress({ request, response, auth} : HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const user = auth.use('api').user
            const { lokasi, alamat_lengkap, detail_tambahan, map_url } = request.all()

            const newAddress = new Address()
            newAddress.fill({
                lokasi,
                alamat_lengkap,
                detail_tambahan,
                map_url,
                user_id: user?.id
            })

            await newAddress.save()

            response.status(200).json({
                status: 200,
                msg: "Alamat berhasil terbuat",
                Address: newAddress,
            })
        } catch (error) {
            response.status(404).json({
                status: 404,
                msg: "Autentikasi gagal"
            })
        }
    }
}
