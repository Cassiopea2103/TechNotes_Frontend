import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";

import jwtDecode from "jwt-decode";

const useAuth= ()=> {

    // retrieve the token from the app state: 
    const token= useSelector( selectCurrentToken )

    // define default states: 
    let isManager= false
    let isAdmin= false 
    let status= 'Employee'

    if ( token ){
        // decode the informations contained in the token: 
        const decoded= jwtDecode( token )

        // retrieve username and roles from the decoded informations: 
        const { username, roles, id }= decoded.userInfo 

        // verify user roles : 
        isManager= roles.includes('Manager')
        isAdmin= roles.includes('Admin')

        //set user status: 
        if ( isManager ) status = 'Manager'
        if ( isAdmin ) status = 'Admin'
    
        return { username, roles, status, isManager, isAdmin, id }
    }
    return { username: '', roles: [], status, isManager, isAdmin, id: undefined }
}

export { useAuth }  