const express = require('express')
const mongoose = require('mongoose')
const app = express()
const pinRoute = require('./routes/pins')
const userRoute = require('./routes/users')
const cors = require('cors')

app.use(cors())
app.use(express.json())

app.use("/api/users",userRoute)
app.use("/api/pins",pinRoute)

mongoose.connect(process.env.MONGOURL).then(()=>
    console.log("database conneted")
).catch((err)=>{console.log(err);})


app.listen(process.env.PORT||5000,()=>{
    console.log("server started");
})