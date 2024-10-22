import { createSlice } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api-client";
import { GET_USER_INFO } from "@/utils/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
const initialState={
    isLoading:false,
    data:null,
    error:null
};
export const getUser=createAsyncThunk('user/getUser',async()=>{
    const userData=await apiClient.get(GET_USER_INFO,{withCredentials:true});
    return userData.data.user;
}
)
export const loginUser=createAsyncThunk('user/loginUser',async()=>{
    const userData=await apiClient.post()
})
export const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        updateUserDetails:(state,action)=>{
           state.data=action.payload
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getUser.pending,(state,action)=>{
            state.isLoading=true
        })
        .addCase(getUser.fulfilled,(state,action)=>{
            console.log(action)
            state.isLoading=false,
            state.data=action.payload
        })
        .addCase(getUser.rejected,(state,action)=>{
            // setLoading=false;
            state.error=action.error | "Backend is Down"
            state.data=undefined
        })
        
    }
})
export const {updateUserDetails}=userSlice.actions
export default userSlice.reducer

