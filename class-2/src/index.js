import express from "express"
import Redis from "ioredis"
import mongoose from "mongoose"

const app = express()   

app.use(express.json())


const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")



const BANNER_KEY = "banner"

app.get("/banner", async (req, res) => {
    const banner = await redis.get(BANNER_KEY)
    return res.json({ banner })
})

app.post("/banner", async (req, res) => {
    console.log(req.body,"REQ_BODU")
    const { banner } = req.body
    await redis.set(BANNER_KEY, banner)
    return res.json({ banner })
})

app.get("/", async (req, res) => {    
    const reply = await redis.ping()
    return res.json(`Redis is working: ${reply}`)
  })



app.listen(4000, () => {   
    console.log("Server is running on port 4000")
 })