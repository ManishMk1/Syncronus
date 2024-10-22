// import { HOST } from "@/utils/constants";
// import {createContext,useContext,useEffect,useRef} from "react";
// import { useSelector } from "react-redux";
// import io from "socket.io-client";
// import {addMessage} from "@/store/chatSlice";
// import { useDispatch } from "react-redux";
// const SocketContext = createContext(null);

// export const useSocket=()=>{
//     return useContext(SocketContext);
// }

// export const  SocketProvider=({children})=>{
// const dispatch=useDispatch();


// const socket=useRef();
// const user=useSelector((state)=>state.user.data);
// const selectedChatData=useSelector((state)=>state.chat.selectedChatData);
// const selectedChatType=useSelector((state)=>state.chat.selectedChatType);
// useEffect(()=>{

//     if(user){
//         socket.current=io(HOST,{
//             withCredentials:true,
//             query:{
//                 userId:user.id,
//             }
//         })
//         socket.current.on("connect",()=>{
//            console.log("Connected to the Socket Server");
//         })
//         const handleReceiveMessage=(message)=>{
//          console.log(message)
//             if(selectedChatType!==undefined &&
//                 selectedChatData?._id===message.sender._id||
//                 selectedChatData?._id===message.recipient._id){
//                 console.log("message received",message)
//                 dispatch(addMessage(message));
//             }

//         }
//         socket.current.on("receiveMessage",handleReceiveMessage);
//         return ()=>{
//             if(socket.current){
//                 socket.current.disconnect();
//             }
//         }
//     }
  
// },[user])

// return (
//     <SocketContext.Provider value={socket.current}>
//         {children}
//     </SocketContext.Provider>
// )
// }
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { addMessage } from "@/store/chatSlice";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const dispatch = useDispatch();
    const socket = useRef();
    const user = useSelector((state) => state.user.data);
    const selectedChatData = useSelector((state) => state.chat.selectedChatData);
    const selectedChatType = useSelector((state) => state.chat.selectedChatType);

    // Refs to keep track of the latest chat data and type
    const selectedChatDataRef = useRef(selectedChatData);
    const selectedChatTypeRef = useRef(selectedChatType);

    useEffect(() => {
        // Update refs whenever selectedChatData or selectedChatType changes
        selectedChatDataRef.current = selectedChatData;
        selectedChatTypeRef.current = selectedChatType;
    }, [selectedChatData, selectedChatType]);

    useEffect(() => {
        if (user) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: {
                    userId: user.id,
                },
            });

            socket.current.on("connect", () => {
                console.log("Connected to the Socket Server");
            });

            const handleReceiveMessage = (message) => {
             console.log(selectedChatDataRef)
                if (
                    selectedChatTypeRef.current !== undefined &&
                    (selectedChatDataRef.current?._id === message.sender._id ||
                     selectedChatDataRef.current?._id === message.recipient._id)
                ) {
                    console.log("message received", message);
                    dispatch(addMessage(message));
                }
            };

            socket.current.on("receiveMessage", handleReceiveMessage);

            return () => {
                if (socket.current) {
                    socket.current.disconnect();
                }
            };
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};
