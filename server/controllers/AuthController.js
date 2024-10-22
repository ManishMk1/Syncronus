import User from "../Models/UserModel.js";
import jwt from 'jsonwebtoken'
import { compare } from "bcrypt";
import { cloudinary } from "../CloudinaryConfig.js";
const maxAge=3*24*60*60*1000;
const createToken=(email,userId)=>{
    return jwt.sign({email,userId},process.env.JWT_KEY,{
        expiresIn:maxAge
    });
}
export const signup=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).send("Email and Password is Required");

        }
        const duplicate=await User.findOne({email});
       if(duplicate){
        return res.status(401).send("Email Already Exists");
       }
        const user = await User.create({email,password});
        res.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None"
        });
        return res.status(201).json({
            user:{
                id:user.id,
                email:user.email,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
                profileSetup:user.profileSetup
            }
        })


    }catch(error){
        console.log("<--Error at Signup -->",error);
        return res.status(500).send("Internal Server Error");
    }
}
export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        console.log(email,password)
        if(!email||!password){
            return res.status(400).send("Email and Password is Required");

        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).send("User with the given email not found");
        }
        const auth =await compare(password,user.password);
        console.log(user.password);
        if(!auth){
            console.log("auth is failed")
            return res.status(404).send("Password is Incorrect");
        }
        res.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None"
        });
    

        return res.status(200).json({
            user:{
                id:user.id,
                email:user.email,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
                profileSetup:user.profileSetup,
                color:user.color
            }
        })


    }catch(error){
        console.log("<--Error at Login -->",error);
        return res.status(500).send("Internal Server Error");
    }
}
export const getInfo=async(req,res)=>{
    try{
        const email=req.email;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).send("User with the given email not found");
        }
        
    
        return res.status(200).json({
            user:{
                id:user.id,
                email:user.email,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
                profileSetup:user.profileSetup,
                color:user.color
            }
        })


    }catch(error){
        console.log("<--Error at get user -->",error);
        return res.status(500).send("Internal Server Error");
    }
}
export const updateProfile=async(req,res)=>{
    try{
        const {firstName,lastName,color}=req.body;
        const userId=req.userId; 
        if(!firstName||!lastName){
            return res.status(400).send("FirstName, LastName and color is required");
        }
        console.log(firstName,lastName,color)
        const user = await User.findByIdAndUpdate(userId,{firstName,lastName,color,profileSetup:true},{new:true,runValidators:true});
        return res.status(200).json({
            user:{
                id:user.id,
                email:user.email,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
                profileSetup:user.profileSetup,
                color:user.color
            }
        })


    }catch(error){
        console.log("<--Error at get user -->",error);
        return res.status(500).send("Internal Server Error");
    }
}
export const addProfileImage=async(req,res,next)=>{
    // console.log("receive");
    if(!req.file){
        return res.status(400).send("File is required");
    }
    const user=await User.findByIdAndUpdate(req.userId,{
        image:req.file.path
    },{new:true,runValidators:true})
    // console.log(req.file.filename);
    // console.log(req.file.path);
    
    return res.status(200).json({
        user:{
            
                id:user.id,
                email:user.email,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
                profileSetup:user.profileSetup,
                color:user.color,
               
            
        }
    })
    return res.send("HH");
}
export const removeProfileImage = async (req, res, next) => {
    try {
      // Find the user by ID
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      const publicId = user.image;
      console.log(publicId)
      
      // Function to extract the public ID from the Cloudinary URL
      const extractPublicId = (url) => {
        const regex = /\/v\d+\/(.+)\./; // Regex to match the public ID in the Cloudinary URL
        const match = url.match(regex);
        return match ? match[1] : null;
      };
  
      // Extract the public ID from the URL
      const cloudinaryPublicId = extractPublicId(publicId);
  
      if (!cloudinaryPublicId) {
        return res.status(400).json({ error: "Invalid image URL" });
      }
  
      // Attempt to delete the image from Cloudinary
      console.log(cloudinaryPublicId)
      const result = await cloudinary.uploader.destroy(cloudinaryPublicId);
      console.log(result)
      if (result.result === 'ok') {
        // Image deletion was successful, now remove the image URL from MongoDB
        user.image = null; // Clear the image field
        await user.save(); // Save the updated user document
       console.log("profile update");
        
       return res.status(200).json({
        user:{
            id:user.id,
            email:user.email,
            firstName:user.firstName,
            lastName:user.lastName,
            image:user.image,
            profileSetup:user.profileSetup,
            color:user.color
        }
       });
      } else {
        res.status(400).json({ error: 'Failed to delete image from Cloudinary' });
      }
    } catch (error) {
      console.error("Error deleting profile image:", error);
      res.status(500).json({ error: 'An error occurred while deleting the image' });
    }
  };
  export const logout=async(req,res)=>{
    try {
       res.cookie("jwt","",{maxAge:1,secure:true,sameSite:"None"});
       console.log("logout");
       return res.status(200).send("Logout Successully ");

    } catch (error) {
        console.log("<--Error at Logout -->",error);
    }
  }