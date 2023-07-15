/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
const { sendOTP } = require("../app/Controllers/Http/OtpController")

Route.get('/', async () => {
  return { msg: 'API Hit Succes' }
})

Route.group(() => {
  Route.post("register", "AuthController.register");
  Route.post("login", "AuthController.login");
  Route.get("users", "UserController.getUser")
  Route.get("token", "UserController.getUserToken")
  Route.put("users/:id", "UserController.update")
  Route.get("orders", "OrderController.getOrder")
  Route.post("orders", "OrderController.createOrder")
}).prefix("v1/api");

Route.post('/otp', async ({ request, response }) => {
  try {
    const { email, subject, message, duration } = request.all()
    const createdOTP = await sendOTP({
      email,
      subject,
      message,
      duration
    })
    response.status(200).json(createdOTP)
  } catch (error) {
    response.status(400).json(error.message)
  }
})
