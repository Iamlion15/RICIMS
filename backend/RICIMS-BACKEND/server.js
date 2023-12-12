const express=require("express");
const cors=require("cors");
const userRoutes=require("./src/routes/userRoute")
const documentRoutes=require("./src/routes/documentRoute")
const commentRoutes=require("./src/routes/commentRoute")
const dbConnect=require("./src/database/db")

//configuring express
const app=express();

//connecting to the database
dbConnect()

//middlewares
app.use(express.json())
app.use(cors({origin:"*"}))
app.use("/api/user",userRoutes)
app.use("/api/document",documentRoutes)
app.use("/api/comment",commentRoutes)





const port=process.env.PORT || 6000
app.listen(port,()=>{
    console.log(`server started on port ${port}`)
})
