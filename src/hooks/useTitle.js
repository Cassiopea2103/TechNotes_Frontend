import { useEffect } from "react";

const useTitle= (title)=> {
    useEffect(
        ()=> {
            const previousTitle= document.title
            document.title= title

            // cleanup function that reset document title back to initial value
            return ()=> document.title= previousTitle
        }, 
        [ title ]
    )
}

export { useTitle }