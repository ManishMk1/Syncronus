import React from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { useSelector } from "react-redux";
import { getColor } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { IoPowerSharp } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { updateUserDetails } from '@/store/userSlice';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { LOGOUT_ROUTE } from '@/utils/constants';
function ProfileInfo() {
    const user = useSelector((state) => state.user.data);
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const logOut = async() => {
        console.log("logout")
        try {
            const response = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true });
            if(response.status===200){
                dispatch(updateUserDetails(null));
                return navigate("/auth")
               
            }
        } catch (error) {
            toast.error(error.message);
        }
    
    }
    return (
        <div className='absolute bottom-0 flex items-center h-16 justify-between px-10 w-full bg-[#2a2b33]'>
            <div className="flex gap-3 items-center justify-center">
                <div className='w-12 h-12 relative'>
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {user?.image ? <AvatarImage src={user.image} alt="profile" className="object-cover w-full h-full bg-black" />
                            : <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(user?.color)}`}>
                                {user.firstName
                                    ? user.firstName.split("").shift()
                                    : user?.email.split("").shift()}
                            </div>
                        }
                    </Avatar>
                </div>
                <div>
                    {
                        user?.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `${user.email}`
                    }
                </div>
                <div className='flex gap-5'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <FiEdit2  className='text-purple-500 text-xl font-medium'  onClick={()=>{return navigate("/profile")}}/>
                            </TooltipTrigger>
                            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                                <p>Edit Profile</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <IoPowerSharp  className='text-red-500 text-xl font-medium'  onClick={logOut}/>
                            </TooltipTrigger>
                            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                                <p>Logout</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                </div>
            </div>
        </div>
    )
}

export default ProfileInfo