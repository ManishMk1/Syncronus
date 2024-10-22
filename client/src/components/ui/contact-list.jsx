import React from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setSelectedChatData, setSelectedChatMessages } from '@/store/chatSlice'
import { setSelectedChatType } from '@/store/chatSlice'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { getColor } from '@/lib/utils'                                          
function ContactList({contacts,isChannel=false}) {
    const dispatch=useDispatch();
    const selectedChatData=useSelector((state)=>state.chat.selectedChatData);
    const selectedChatType=useSelector((state)=>state.chat.selectedChatType);
    const handleClick=(contact)=>{
        if(isChannel) dispatch(setSelectedChatType("channel"));
        else dispatch(setSelectedChatType("Contact"));
        dispatch(setSelectedChatData(contact));
        if(selectedChatData && selectedChatData._id!==contact._id){
           dispatch(setSelectedChatMessages([]));
        }

    }
  return (
   <div className='mt-5'>
 {   contacts.map((contact)=>(<div key={contact._id} className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData&& selectedChatData._id===contact._id?"bg-[#8417ff] hover:bg-[#8417ff]":"hover:bg-[#f1f1f111]"}`} onClick={()=>handleClick(contact)}>
   

<div className='flex gap-5 items-center justify-start text-neutral-300'>
{
    !isChannel && <div className='w-10 h-10 relative'>
    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
      {contact?.image ? (
        <AvatarImage src={contact.image} alt="profile" className="object-cover w-full h-full bg-black" />
      ) : (
        <div className={`uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact?.color)}`}>
          {contact.firstName
            ? contact.firstName.split("").shift()
            : contact?.email.split("").shift()}
        </div>
      )}
    </Avatar>
    {/* <div>
              {contact?.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : `${contact.email}`}
            </div> */}
  </div>
}
</div>

        </div>))}
   </div>
  )
}

export default ContactList