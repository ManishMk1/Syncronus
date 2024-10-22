
import Background from '@/assets/login2.png'

import Victory from '@/assets/victory.svg'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { act, useState } from 'react'
import { toast } from "sonner"
import { apiClient } from '@/lib/api-client'
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants'
import { useNavigate } from 'react-router-dom'
import { updateUserDetails } from '@/store/userSlice'
import { useDispatch } from 'react-redux'
function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [activeTab, setactiveTab] = useState("login");
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
        return regex.test(email);
      };
    const validatePassword=(password)=>{
        return password.length>=6?true:false
    }
    const validateSignup=()=>{
        if(!email.length){
           toast.error("Email is Required");
           return false;
        }
        if(!validateEmail(email)){
            toast.error("Enter a valid Email Address")
            return false;
        }
        if(!validatePassword(password)){
            toast.error("Enter a password with length 6 or more");
            return false;
        }
        if(!password.length){
            toast.error("Password is Required")
            return false;
        }
        if(confirmPassword!==password){
            toast.error("Password & Confirm Password should be same")
            return false;
        }
        return true;
    }
    const validateSignin=()=>{
        if(!email.length){
           toast.error("Email is Required");
           return false;
        }
        if(!validateEmail(email)){
            toast.error("Enter a valid Email Address")
            return false;
        }
        if(!validatePassword(password)){
            toast.error("Enter a password with length 6 or more")
            return false;
        }
        if(!password.length){
            toast.error("Password is Required")
            return false;
        }
        return true;
    }
    const handleLogin=async ()=>{
        if(validateSignin()){
            try {
                const response=await apiClient.post(LOGIN_ROUTE,{email,password},{withCredentials:true})
                console.log(response);
                if(response.status==200){
                    if(response.data?.user){
                        dispatch(updateUserDetails(response.data.user))
                        return navigate("/chat");
                        }else{
    
                           toast("Error at Backend")
                        }
                }
            } catch (error) {
               
               if(error.response){
                toast(error.response?.data)
               } else{
                toast("Server is Down. Please Try after a minute")
               }
                
            }
           
            
            }
           
        }
       

    
    const handleSignup=async ()=>{

        if(validateSignup()){
            try {
                const response=await apiClient.post(SIGNUP_ROUTE,{email,password},{withCredentials:true})
                if(response.status==201){
                    console.log(response.data.user)
                    if(response.data?.user){
                        dispatch(updateUserDetails(response.data.user))
                        return navigate("/chat");
                        }else{
    
                           toast("Error at Backend")
                        }
                }
            } catch (error) {
                if(error.response){
                    toast(error.response?.data)
                   } else{
                    toast("Server is Down. Please Try after a minute")
                   }
            }
           
        }
    }
    return (
        <div className="h-[100vh] w-[100vw] flex items-center justify-center">
            <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 w-[80vw] shadow-2xl md:w-[90vw] lg:w-[70vw]xl:w-[60vw] rounded-xl grid xl:grid-cols-2 ">
                <div className="flex flex-col gap-10 item-center justify-center">
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
                            <img src={Victory} alt="victory" className='h-[100px]' />
                        </div>
                        <p className='font-medium text-center'>
                            Fill in the details to get started with the best chat app!
                        </p>

                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Tabs className='w-3/4' value={activeTab} onValueChange={setactiveTab}>
                            <TabsList className="flex items-center w-full bg-transparent">
                                <TabsTrigger value="login" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 transition-all duration-300 p-3 ">Login</TabsTrigger>
                                <TabsTrigger value="signup" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 transition-all p-3 duration-300">Signup</TabsTrigger>
                            </TabsList>
                            <TabsContent value="login" className="flex flex-col gap-5 mt-10">
                                <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <Input placeholder="Password" type="password" className="rounded-full p-6" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <Button className="rounded-full p-6" onClick={handleLogin}>Login</Button>

                            </TabsContent>
                            <TabsContent value="signup" className="flex flex-col gap-5">
                                <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <Input placeholder="Password" type="password" className="rounded-full p-6" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <Input placeholder="Confirm Password" type="text" className="rounded-full p-6" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                <Button className="rounded-full p-6" onClick={handleSignup}>SignUp</Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                    <div className='xl:flex justify-center items-center hidden '>
                        <img src={Background} alt="Background Image" className='w-[400px]' />

                    </div>
            </div>
        </div>
    )
}

export default Auth