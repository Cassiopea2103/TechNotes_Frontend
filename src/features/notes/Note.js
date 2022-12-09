import { useGetAllNotesQuery } from "./notesApiSlice";

import { useGetAllUsersQuery } from "../users/usersApiSlice";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import { memo } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const Note= ({ noteId, users })=> {

    const { id }= useAuth()

    const { note }= useGetAllNotesQuery(
        'notesList',
        {
            selectFromResult: ({ data })=> ({
                note: data?.entities[ noteId ]
            })
        }
    )

    const { noteUser } = useGetAllUsersQuery(
        'usersList', 
        {
            selectFromResult: ({ data })=> ({
                noteUser: data?.entities[id].username
            })
        }
    )

    const navigate= useNavigate()
    
    
    
    if (note){
        
        // const noteUser= Object.values( users ).filter((user)=> user.id=== note.user )[0]

        const handleEdit= ()=> navigate(`/dash/notes/edit/${noteId}`)

        const noteRow= (
            <tr className= 'table__row'>
                <th className = 'table__th note__status'>
                    {
                        note.completed
                        ? <span className= 'note__status--completed'>Completed</span>
                        : <span className= 'note__stutus--incompleted'>Open</span>
                    }
                </th>
                <th className="table__cell note__created">
                    {note.createdAt}
                </th>
                <th className="table__cell note__updated">
                    {note.updatedAt}
                </th>
                <th className="table__cell note__title">
                    {note.title}
                </th>
                <th className="table__cell note__username">
                    { noteUser }
                </th>
                <th className="table__cell">
                    <button
                        className= 'table__button icon-button'
                        title= 'Edit Note'
                        onClick= { handleEdit }
                    >
                        <FontAwesomeIcon
                            icon={ faPenToSquare }
                        />
                    </button>
                </th>
            </tr>
        )

        return noteRow
    }
    
    else {
        return null
    }
}

const memoizedNote= memo(Note)

export default memoizedNote 