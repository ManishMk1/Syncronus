import Messages from "../Models/MessagesModel.js";
 
export const getMessages=async(req,res)=>{
try {

    const user1=req.userId;
    const user2=req.body.id;
    if(!user1 || !user2){
        return res.status(400).json({message:"Both user ID's are required"});

    }   
    const messages=await Messages.find({
        $or:[
            {sender:user1,recipient:user2},
            {sender:user2,recipient:user1}
        ]
    }).sort({timestamp:1});
    return res.status(200).json({messages}); 
} catch (error) {
    console.log(error);
}
}