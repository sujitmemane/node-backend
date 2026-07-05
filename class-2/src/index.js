import express from "express"
import Redis from "ioredis"
import mongoose from "mongoose"

const app = express()   

app.use(express.json())


const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")


function otpKey(phoneNumber) {
    return `otp:${phoneNumber}`
}

app.post("/otp",async (req, res) => {  
    const { phoneNumber } = req.body
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await redis.set(otpKey(phoneNumber), otp, "EX", 30) 
    return res.json({ otp, message: "OTP sent successfully" })
 })


 app.post("/otp/verify", async (req, res) => {
    const { phoneNumber, otp } = req.body
    const storedOtp = await redis.get(otpKey(phoneNumber))
    if(!storedOtp) {
        return res.status(400).json({ message: "OTP expired or not found" })
    }
    if (storedOtp === otp) {
        await redis.del(otpKey(phoneNumber))
        return res.json({ message: "OTP verified successfully" })
    } else {
        return res.status(400).json({ message: "Invalid OTP" })
    }   
 })



 app.get("/otp/:phoneNumber/ttl", async (req, res) => {
    const { phoneNumber } = req.params
    const storedOtp = await redis.get(otpKey(phoneNumber))
    if(!storedOtp) {
        return res.status(400).json({ message: "OTP expired or not found" })
    }
    const ttl = await redis.ttl(otpKey(phoneNumber))
    return res.json({ metaData: { ttl } })
 })



// const BANNER_KEY = "banner"

// app.get("/banner", async (req, res) => {
//     const banner = await redis.get(BANNER_KEY)
//     return res.json({ banner })
// })

// app.post("/banner", async (req, res) => {
//     console.log(req.body,"REQ_BODU")
//     const { banner } = req.body
//     await redis.set(BANNER_KEY, banner)
//     return res.json({ banner })
// })

// app.get("/", async (req, res) => {    
//     const reply = await redis.ping()
//     return res.json(`Redis is working: ${reply}`)
//   })



app.listen(4000, () => {   
    console.log("Server is running on port 4000")
 })