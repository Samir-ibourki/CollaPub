import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './prisma/client.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3030

// middlewares
app.use(cors())
app.use(express.json()) 

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
