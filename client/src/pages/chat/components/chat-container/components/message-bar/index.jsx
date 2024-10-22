// import React, { useEffect } from 'react'
// import { useState } from 'react';
// import {GrAttachment} from 'react-icons/gr'
// import {RiEmojiStickerLine} from 'react-icons/ri'
// import {IoSend} from 'react-icons/io5'
// import { useRef } from 'react';
// import EmojiPicker from 'emoji-picker-react';
// import { useSelector } from 'react-redux';
// import { useSocket } from '@/context/SocketContext';
// function MessageBar() {
//   const emojiRef=useRef();
//   const socket=useSocket();
//   const [message, setMessage] = useState("");
//   const [emojiPickerOPen,setEmojiPickerOpen]=useState(false);
//   const selectedChatData=useSelector((state)=>state.chat.selectedChatData);
//   const selectedChatType=useSelector((state)=>state.chat.selectedChatType);
//   const user=useSelector((state)=>state.user.data);

//   useEffect(()=>{
//     function handleClickOutside(event){
//       if(emojiRef.current && !emojiRef.current.contains(event.target)){
//         setEmojiPickerOpen(false);
//       }
//     } 
//     document.addEventListener("mousedown",handleClickOutside);
//     return ()=>{
//       document.removeEventListener("mousedown",handleClickOutside);
//     }
//   },[emojiRef])
//   const handleEmoji =(emoji)=>{
//     setMessage((msg)=>msg+emoji.emoji);
//   }
//   const handleSendMessage=()=>{
//     if(selectedChatType==="Contact"){
//       setMessage("");
//       console.log("sending message")
//       socket.emit("sendMessage",{
//         sender:user.id,
//         content:message,
//         recipient:selectedChatData._id,
//         messageType:"text",
//         fileUrl:undefined,
//       })
//     }
//   }
//   return (
//     <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 gap-6'>
//       <div className='flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5'>
//         <input type="text" className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none' placeholder='Enter Message' onChange={(e)=>{setMessage(e.target.value)}} value={message}/>
//         <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
//           <GrAttachment className='text-2xl'/>
//         </button>
//         <div className='relative'>
//           <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={()=>{setEmojiPickerOpen(true)}}>
//             <RiEmojiStickerLine className='text-2xl'/>
//           </button>
//           <div className='absolute bottom-16 right-0' ref={emojiRef}>
//             <EmojiPicker theme="dark" open={emojiPickerOPen} onEmojiClick={handleEmoji} autoFocusSearch={false}/>
//           </div>
//         </div>
//       </div>
//       <button className='bg-[#8417ff] rounded-md flex justify-center items-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={handleSendMessage}>
//            <IoSend className='text-2xl'/>
//           </button>
//     </div>
//   )
// }

// export default MessageBar
import React, { useEffect, useRef, useState } from 'react';
import { GrAttachment } from 'react-icons/gr';
import { RiEmojiStickerLine } from 'react-icons/ri';
import { IoSend } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import { useSelector } from 'react-redux';
import { useSocket } from '@/context/SocketContext';

// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

function MessageBar() {
  const emojiRef = useRef();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const selectedChatData = useSelector((state) => state.chat.selectedChatData);
  const selectedChatType = useSelector((state) => state.chat.selectedChatType);
  const user = useSelector((state) => state.user.data);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  // Debounced send message function
  const debouncedSendMessage = debounce(() => {
    if (selectedChatType === "Contact" && message.trim()) {
      setIsSending(true);
      console.log("Sending message");

      socket.emit("sendMessage", {
        sender: user.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });

      // Reset message and enable button
      setMessage("");
      setIsSending(false);
    }
  }, 500); // Adjust delay as needed

  const handleSendMessage = () => {
    debouncedSendMessage();
  };

  return (
    <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 gap-6'>
      <div className='flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5'>
        <input
          type="text"
          className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none'
          placeholder='Enter Message'
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          disabled={isSending}
        />
        {/* <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
          <GrAttachment className='text-2xl' />
        </button> */}
        <div className='relative'>
          <button
            className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className='text-2xl' />
          </button>
          <div className='absolute bottom-16 right-0' ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className={`bg-[#8417ff] rounded-md flex justify-center items-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleSendMessage}
        disabled={isSending}
      >
        <IoSend className='text-2xl' />
      </button>
    </div>
  );
}

export default MessageBar;
