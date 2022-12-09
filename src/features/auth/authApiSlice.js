import { apiSlice } from "../../app/api/apiSlice";

import { logout, setCredentials } from "./authSlice";

// queries to communicate with auth endpoints of the server 
export const authApiSlice= apiSlice.injectEndpoints({
    endpoints: builder=> ({
        
        // login : 
        login : builder.mutation({
            query: ( credentials )=> ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials }
            })
        }),

        refresh: builder.mutation({
            query: ()=> ({
                url: '/auth/refresh',
                method: 'GET'
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }){
                try{ 
                    const response= await queryFulfilled 
    
                    const { data }= response 
                    dispatch(setCredentials ( data ))
                }
                catch( error ){
                    console.log(error)
                }
            }
        }),

        sendLogout: builder.mutation({
            query: ()=> ({
                url: '/auth/logout',
                method: 'POST'
            }),
            async onQueryStarted( arg, { dispatch, queryFulfilled }){
                try {
                    // await query to be fulfilled
                    const result= await queryFulfilled 
                    console.log(result)

                    // initiate the logout action creator to set token to null 
                    dispatch( logout() )
                    setTimeout(
                        ()=> {
                            dispatch ( apiSlice.util.resetApiState() )
                        },
                        2000
                    )
                }
                catch( error ){
                    console.log( error )
                }
            }
        })
    })
})

export const { 
    useLoginMutation,
    useRefreshMutation,
    useSendLogoutMutation
}= authApiSlice