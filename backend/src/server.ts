import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './prisma/client.js'
import authRouter from './modules/auth/auth.routes.js'
import profileRouter from './modules/profiles/profile.routes.js'
import postRouter from './modules/posts/post.routes.js'
import collaborationRouter from './modules/collaborations/collaboration.routes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { generalLimiter } from './middleware/rateLimiter.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3030

// middlewares
app.use(cors())
app.use(express.json()) 
app.use("/api", generalLimiter)

// routes
app.use("/api/auth", authRouter)
app.use("/api/profiles", profileRouter)
app.use("/api/posts", postRouter)
app.use("/api/collaborations", collaborationRouter)

// error handler 
app.use(errorHandler)

async function main() {
    try {
        await prisma.$connect()
        console.log("Database connected successfully")
        
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT} `)
        })
    } catch (error) {
        console.error("Failed to connect to database :", error)
        await prisma.$disconnect()
        process.exit(1)
    }
}

main()
