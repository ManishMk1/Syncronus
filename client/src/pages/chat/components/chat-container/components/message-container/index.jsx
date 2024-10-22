import moment from 'moment';
import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { setSelectedChatMessages } from '@/store/chatSlice';
import { useDispatch } from 'react-redux';
import { apiClient } from '@/lib/api-client';
import { GET_ALL_MESSAGES_ROUTE } from '@/utils/constants';

function MessageContainer() {
  const selectedChatData=useSelector((state)=>state.chat.selectedChatData);
  const selectedChatType=useSelector((state)=>state.chat.selectedChatType);
  const user=useSelector((state)=>state.user.data);
  const selectedChatMessages=useSelector((state)=>state.chat.selectedChatMessages);
  const dispatch=useDispatch();
  const scrollRef=useRef();
  useEffect(()=>{
    if(scrollRef.current){
      scrollRef.current.scrollIntoView({behavior:"smooth"})
    }
  },[selectedChatMessages])
  useEffect(()=>{
    const getMessages=async()=>{
      try {
        const response=await apiClient.post(GET_ALL_MESSAGES_ROUTE,{id:selectedChatData._id},{withCredentials:true});
        if(response.data.messages){
          dispatch(setSelectedChatMessages(response.data.messages));
        }
        
      } catch (error) {
          console.log(error);
      }
    }
    if(selectedChatData._id){
      if(selectedChatType==="Contact"){
       getMessages();
      }
    }
  },[selectedChatData,selectedChatType,setSelectedChatMessages])
  const renderMessages=()=>{
    let lastDate=null;
    return selectedChatMessages.map((message,index)=>{
      const messageDate=moment(message.timeStamp).format("YYYY-MM-DD");
      const showDate=messageDate!==lastDate;
      lastDate=messageDate;
      return (
        <div key={index}>
            {
              showDate&& <div className='text-center text-gray-500 my-2'>
                {moment(message.timeStamp).format("LL")}
              </div>
            }
            {
              selectedChatType==="Contact" && renderDMMessages(message)
            }
        </div>
      )
    })
  }
  const renderDMMessages=(messages)=>(
  <div className={`${messages.sender===selectedChatData._id?"text-left":"text-right"}`}>
  {
    messages.messageType==="text" &&(<div className={`${messages.sender!==selectedChatData._id?"bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50":"bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>{messages.content}</div>)
  }
  <div className='text-xs text-gray-600'>
  { moment(messages.timeStamp).format("LT")
  }
  </div>
  </div>
  )
  return (
    <div className='flex-1 overflow-y-auto scrollbar-hidden p-4 px-9 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full'>
      {renderMessages()}
      <div ref={scrollRef}></div>
    </div>
  )
}

export default MessageContainer