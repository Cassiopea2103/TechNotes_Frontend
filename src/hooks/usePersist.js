import { useState, useEffect } from "react";

const usePersist= ()=> {
    const data= localStorage.getItem('persist') || false 

    // set persit state to localStorage retrieved data:
    const [ persist, setPersist ]= useState(JSON.parse(data))

    // store persist data back into localStorage: 
    useEffect(
        ()=> {
            localStorage.setItem('persist', JSON.stringify(persist))
        }, 
        [ persist ]
    )
    
    return [ persist, setPersist ]
}

export { usePersist }