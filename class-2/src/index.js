import express from "express"
import Redis from "ioredis"
import mongoose from "mongoose"

const app = express()   


const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")




app.get("/", async (req, res) => {    
    const reply = await redis.ping()
    return res.json(`Redis is working: ${reply}`)
  })



app.listen(4000, () => {   
    console.log("Server is running on port 4000")
 })