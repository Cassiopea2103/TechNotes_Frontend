import { Outlet, Link } from "react-router-dom";

import { useState, useEffect, useRef } from "react";

import { usePersist } from "../../hooks/usePersist";

import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

import { useRefreshMutation } from "./authApiSlice"; 

const PersistLogin= ()=> {

    let token= useSelector( selectCurrentToken )

    const [
        refresh,
        {
            isUninitialized,
            isLoading, 
            isSuccess,
            isError,
            error
        }
    ]= useRefreshMutation()

    const [ trueSuccess, setTrueSuccess ]= useState( false )

    const effectRan= useRef( false )

    useEffect(
        ()=> {
            // handle React Strict Mode and send a refresh token request 
            // to get a new access token. 
            // Component will be wrapped around all children Components so
            // everytime we request a page we already have a token.
            if ( effectRan.current === true && process.env.NODE_ENV === 'development' ){
                // function to get an access token with the refresh token: 
                const getAccessToken= async()=> {
                    try{
                        console.log('Getting a new access token...')
                        await refresh()
    
                        // isSuccess can be true before the credentials in refresh function
                        // are set. So we add a setTrueSuccess to prevent that .
                        setTrueSuccess( true )
                    }
                    catch ( error ){
                        console.log( error )
                    }
                }

                if ( !token && persist ){
                    getAccessToken()
                }
            }
            // cleanup function to set effectRan to true: 
            return ()=> {
                effectRan.current = true 
            } 
        },
        // eslint-disable-next-line
        []
    )

    const [ persist ]= usePersist()

    let content 

    if (!persist){
        console.log('No persist')
        content= <Outlet/>
    }
    else if ( isLoading ){
        console.log('loading...')
        content= <p>Loading...</p>
    }
    else if ( isError ){
        console.log('getting access token through refresh token error!')
        content= (
            <p
                className="errMsg"
            >
                { error?.data?.message }
                <Link to={'/login'}>Login again please!</Link>
            </p>
        )
    }
    else if ( isSuccess && trueSuccess ){
        console.log('success')
        content= <Outlet/>
    }
    else if ( token && isUninitialized ){
        console.log( 'token and uninitialized ')
        console.log('isUninitialized')
        content= <Outlet/>
    }

    return content
}

export default PersistLogin