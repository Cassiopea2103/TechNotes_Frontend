import NewNoteForm from "./NewNoteForm";

import { useGetAllUsersQuery } from "../users/usersApiSlice";

import PulseLoader from "react-spinners/PulseLoader";

import { memo } from "react";

const NewNote= ()=> {

    const { users }= useGetAllUsersQuery(
        'usersList',
        { 
            selectFromResult: ({ data })=> ({
                users: data?.ids.map(( userId )=> data?.entities[userId])
            })
        }
    )

    if ( !users?.length ){
        return (
            <PulseLoader
                color="#fff"
            />
        )
    }

    const content= users.length
                 ? <NewNoteForm users= { users } />
                 :
                    <h1>Impossible to create a note for the moment</h1>

    return content
}

const memoizedNewNote= memo(NewNote)

export default memoizedNewNote