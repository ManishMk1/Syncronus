
import React, { useState, useEffect } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { FaPlus } from 'react-icons/fa'
import Lottie from 'react-lottie'
import { animationDefaultOptions } from '@/lib/utils'
import { SEARCH_CONTACTS_ROUTE } from '@/utils/constants.js'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { getColor } from '@/lib/utils'
import { setSelectedChatData,setSelectedChatType } from '@/store/chatSlice'
import { useDispatch } from 'react-redux'

function NewDM() {
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchContacts, setSearchContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const dispatch=useDispatch();

    const searchContact = async (term) => {
        try {
            if (term.length > 0) {
                const response = await apiClient.post(SEARCH_CONTACTS_ROUTE, { searchTerm: term }, { withCredentials: true });
                if (response.status === 200 && response.data.contacts) {
                    setSearchContacts(response.data.contacts);
                }
            } else {
                setSearchContacts([]);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleInputChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        // Clear the previous timeout if user types again
        if (debounceTimeout) clearTimeout(debounceTimeout);

        // Set a new timeout
        const timeout = setTimeout(() => {
            searchContact(term);
        }, 400); // 500ms delay

        setDebounceTimeout(timeout);
    }

    const selectNewContact =(contact)=>{
                setOpenNewContactModal(false);
                setSearchContacts([]);
                setSearchTerm("");
                dispatch(setSelectedChatData(contact));
                dispatch(setSelectedChatType("Contact"));


    }
    return (
        <div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className='text-neutral-500 font-light text-opacity-90 text-start hover:text-neutral-100 transition-all duration-300' onClick={() => { setOpenNewContactModal(true) }} />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] text-white border-none mb-2 p-3">
                        Select New Contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-center">Please Select a Contact</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Search Contacts"
                            className="rounded-lg p-6 bg-[#2c2c3e] border-none"
                            onChange={handleInputChange}
                            value={searchTerm}
                        />
                    </div>
                    {
                        searchContacts.length > 0 && 
                    
                    <ScrollArea className="h-[250px]">
                        <div className='flex flex-col gap-5'>
                            {searchContacts.map(contacts => (
                                <div key={contacts._id} className='flex gap-3 items-center cursor-pointer' onClick={()=>{selectNewContact(contacts)}}>
                                    <div className='w-12 h-12 relative'>
                                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                            {contacts?.image ? (
                                                <AvatarImage src={contacts.image} alt="profile" className="object-cover w-full h-full bg-black" />
                                            ) : (
                                                <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contacts?.color)}`}>
                                                    {contacts.firstName
                                                        ? contacts.firstName.split("").shift()
                                                        : contacts?.email.split("").shift()}
                                                </div>
                                            )}
                                        </Avatar>
                                    </div>
                                    <div className="flex flex-col">
                                        <span>
                                            {contacts?.firstName && contacts.lastName ? `${contacts.firstName} ${contacts.lastName}` : `${contacts.email}`}
                                        </span>
                                        <span className="text-xs">{contacts?.email}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>}
                    {searchContacts.length <= 0 && (
                        <div className='flex-1  md:flex  mt-5 md:mt-0 flex-col justify-center items-center duration-100 transition-all'>
                            <Lottie isClickToPauseDisabled={true} height={100} width={100} options={animationDefaultOptions} />
                            <div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-2xl text-xl transition-all duration-300'>
                                <h3 className='poppins-medium'>
                                    Hi<span className='text-purple-500'>!</span>Search New
                                    <span className='text-purple-500 '>Contacts</span><span className='text-purple-500'>.</span>
                                </h3>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default NewDM
