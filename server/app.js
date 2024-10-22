import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import connection from "./databaseConnection.js"
import authRoutes from "./routes/AuthRoutes.js"
import contactRoutes from "./routes/ContactRoute.js"
import setupSocket from "./socket.js"
import messagesRoutes from "./routes/MessagesRoutes.js"
dotenv.config()
const app=express();
const port=process.env.PORT||8000;
const databaseURL=process.env.DATABASE_URL;

app.use(cors({
    origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true,
}))
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/contacts",contactRoutes)
app.use("/api/messages",messagesRoutes);

const server = app.listen(port,()=>{
    console.log(`Server is Live and it is running at port ${process.env.PORT}`);
})

setupSocket(server);
connection(databaseURL);
app.get("/",(req,res)=>{
    res.send(`Welcome to the server `);
})
