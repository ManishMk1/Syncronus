import mongoose from "mongoose";
function connection (url){
    mongoose.connect(url).then(()=>{
        console.log("DB Connected")
    })
    .catch((error)=>{
        console.log("<--Error in Database Connection -->\n",error)
    })
}
export default connection;