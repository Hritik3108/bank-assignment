import { createSlice } from "@reduxjs/toolkit";

const visiblitySlice = createSlice({
    name:"visiblity",
    initialState: {
        transactionVisiblity:false,
        transactionType:'withdraw',
    },
    reducers:{
        setTransactionVisiblity: (state,action) => {
            state.transactionVisiblity=action.payload;
        },
        setTransactionType: (state,action) => {
            state.transactionType=action.payload;
        }
    }
});

export const {setTransactionVisiblity,setTransactionType} = visiblitySlice.actions;

export default visiblitySlice.reducer;