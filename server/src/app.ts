import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import userRouter from './Routes/userRoutes'
import adminRouter from './Routes/adminRoutes'
import { db } from './config'

require('dotenv').config()


//Sequelize connection
db.sync().then(() => {
    console.log('DB connected successfully')
}).catch(err => {
 console.log(err)
})


const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json({}))
app.use(logger('dev'))
app.use(cookieParser())
app.use(cors())

app.use('/users',userRouter)
app.use('/admins',adminRouter)



const PORT = process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`)
})