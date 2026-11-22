import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './prisma/client.js'
import authRouter from './modules/auth/auth.routes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { generalLimiter } from './middleware/rateLimiter.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3030

// middlewares
app.use(cors())
app.use(express.json()) 
app.use(errorHandler)
app.use("/api", generalLimiter);


// routes
app.use("/api/auth", authRouter)



async function main() {
    try {
        await prisma.$connect()
        console.log("Database connected successfully")
        
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error("Failed to connect to database :", error)
        await prisma.$disconnect()
        process.exit(1)
    }
}

main()
