import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    token: null
}

const authSlice= createSlice(
    {
        name: 'auth',
        initialState: initialState,
        reducers: {
            // set the token state 
            setCredentials: ( state, action )=> {
                state.token= action.payload
            },

            // set the token to null after logout 
            logout: ( state, action )=> {
                state.token= null 
            }
        }
    }
)

//exports for the store 
export default authSlice.reducer 

// export slice action creators: 
export const { setCredentials, logout }= authSlice.actions

// selector to get the current token: 
export const selectCurrentToken=  state => state.auth.token