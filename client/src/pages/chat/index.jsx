import { useEffect } from "react";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {toast} from 'sonner'
import { NavLink } from "react-router-dom";
import ChatContainer from "./components/chat-container"
import EmptyChatContainer from "./components/empty-chat-container";
import ContactsContainer from "./components/contacts-container"
function Chat() {
  const user=useSelector((state)=>state.user.data)
  const chatType=useSelector((state)=>state.chat.selectedChatType)
  const navigate=useNavigate();
  useEffect(()=>{
    if(!user.profileSetup){
   
      toast("Please setup profile to continue..")
      navigate("/profile");
    }
  },[])
  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactsContainer></ContactsContainer>
      {
        chatType===undefined?<EmptyChatContainer></EmptyChatContainer>:<ChatContainer></ChatContainer>
      }
     
     
     
    </div>
  )
}

export default Chat