import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const serverUrl= 'https://technotes-api-b2be.onrender.com/'

// including token we get from the backend response in request headers:
const baseQuery= fetchBaseQuery({
    baseUrl: serverUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState })=> {
        // retrieve token from app state: 
        const token= getState().auth.token

        // include token in authorization headers: 
        if ( token ){
            headers.set('authorization', `Bearer ${ token }`)
        }

        return headers 
    }
})

// send an access token back every time it expires :
const baseQueryWithReauth= async( args, api, extraOptions )=> {
    // try to get a result with actual access token: 
    let result= await baseQuery( args, api, extraOptions )

    // if request fails, it send back error statuses: 
    if ( result?.error?.status === 403 ){
        // try to get another result: 
        const refreshResult= await baseQuery('/auth/refresh', api, extraOptions )

        // set new access token as app state: 
        if ( refreshResult?.data ){
            await api.dispatch( setCredentials(refreshResult.data) )

            // retry original query with new access token:
            result= await baseQuery( args, api, extraOptions ) 
        }
        else 
            if ( refreshResult.error.status === 403 ){
                refreshResult.error.data.message= `Your login has expired!`
            }
            return refreshResult
    }

    return result
}

export const apiSlice= createApi(
    {
        reducerPath: 'api',
        baseQuery: baseQueryWithReauth,
        tagTypes: ['Users', 'Notes'],
        endpoints: builder=> ({})
    }
)