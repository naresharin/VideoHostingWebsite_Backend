import 'dotenv/config'
import connectDB from "./db/index.js"
import { app } from './app.js'

connectDB()
.then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log(`${process.env.USER} is running server at port: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MongoDB Connection Failed: ",err)
})
 
