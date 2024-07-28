import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState: {
        user:{},
        token:"",
        sessionActive:false,
    },
    reducers:{
        addUser: (state,action) => {
            // console.log('payload',action.payload);
            state.user={...action.payload.user};
            state.token=action.payload.token;            
            state.sessionActive=true;
            console.log('user',state.user,'token',state.token,'session',state.sessionActive);
        },
        updateUser: (state,action) => {
            state.user={...action.payload}; 
        },
        updateUserBalance: (state,action) => {
            // console.log('bal',action.payload)
            state.user.balance=action.payload; 
        },
        logoutUser: (state, action) => {
           state.user={};
           state.token="";
           state.sessionActive=false;
        },
        
    }
});

export const {addUser, logoutUser,updateUser,updateUserBalance} = userSlice.actions;

export default userSlice.reducer;