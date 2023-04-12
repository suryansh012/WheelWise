const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const authController = require('./controllers/AuthController')
const EmailController = require('./controllers/EmailController')
const VehicleController = require('./controllers/VehicleController')
const app = express()
const cookieParser = require('cookie-parser')

const port = process.env.PORT || 4000
require('dotenv').config()

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB', err)
  })

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'))

app.use(EmailController)
app.use(authController)
app.use(VehicleController)

app.listen(port, () => {
  console.log('Server is running on port ', port)
})
