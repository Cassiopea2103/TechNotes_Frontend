import EditUserForm from './EditUserForm'

import { useParams } from 'react-router-dom'

import { useGetAllUsersQuery } from './usersApiSlice'

import { PulseLoader } from 'react-spinners'

const EditUser= ()=> {

    const { userId }= useParams()

    const { user }= useGetAllUsersQuery(
        'usersList',
        { 
            selectFromResult: ({ data })=> ({
                user: data?.entities[userId]
            })
        }
    )

    if (!user){
        return (
            <PulseLoader
                color= '#fff'
            />
        )
    }

    const content= user 
                 ? <EditUserForm user= {user}/>
                 : <>
                        <h2>User not found!</h2>
                        <p>An error occured while fetching the  user!</p>
                   </>

    return content
    
}

export default EditUser