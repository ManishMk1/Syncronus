import React from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { closeChat } from '@/store/chatSlice'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { getColor } from '@/lib/utils'

function ChatHeader() {
  const dispatchEvent = useDispatch()
  const chatData = useSelector(state => state.chat.selectedChatData)
  const chatType = useSelector(state => state.chat.selectedChatType)
  return (
    <div className='h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20'>
      <div className='flex gap-5 items-center w-full justify-between'>
        <div className="flex gap-3 items-center justify-center">
          <div className='w-12 h-12 relative'>
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {chatData?.image ? (
                <AvatarImage src={chatData.image} alt="profile" className="object-cover w-full h-full bg-black" />
              ) : (
                <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(chatData?.color)}`}>
                  {chatData.firstName
                    ? chatData.firstName.split("").shift()
                    : chatData?.email.split("").shift()}
                </div>
              )}
            </Avatar>
          </div>
          <div>
            {chatType === "Contact" ? <div>
              {chatData?.firstName && chatData.lastName ? `${chatData.firstName} ${chatData.lastName}` : `${chatData.email}`}
            </div>:<div></div>}
          </div>
        </div>
        <div className='flex items-center justify-center gap-5'>
          <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={() => { dispatchEvent(closeChat()) }}>
            <RiCloseFill className='text-3xl' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader