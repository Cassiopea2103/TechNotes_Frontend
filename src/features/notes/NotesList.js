import { useGetAllNotesQuery } from "./notesApiSlice"

import { useAuth } from "../../hooks/useAuth"


import Note from './Note'

const NotesList= ()=> {

    const { id, isManager, isAdmin } = useAuth()

    const {
        data: notes,
        isLoading, 
        isSuccess,
        isError, 
        error
    }= useGetAllNotesQuery(
        'Notes',
        {
            pollingInterval: 30000,
            refetchOnFocus: true,
            refetchOnMountOrArgChange: true
        }
    )

    let content 

    if ( isLoading ){
        content= <p>Loading notes...</p>
    }

    if (isError){
        content= <p className= 'errMsg'>{error?.data?.message}</p>
    }

    if ( isSuccess ){

        const { ids, entities }= notes 

        // accessing only notes of the user if he got Employee status: 
        let filteredIds 
        if ( isManager || isAdmin ){
            filteredIds= [ ...ids ]
        }
        else { 
            filteredIds= ids.filter((noteId)=> 
                entities[noteId].user=== id
            )
        }

        const tableContent= ids?.length&& filteredIds.map((noteId)=> <Note 
                                                    key= {noteId} 
                                                    noteId= {noteId}
                                                    />)

        content= (
            <table className= 'table table--notes'>
                
                <thead className= 'table__thead'>
                    <tr>
                        
                        <th scope= 'col' className= 'table__th note__status'>
                            Status
                        </th>
                        <th scope= 'col' className= 'table__th note__created'>
                            Created
                        </th>
                        <th scope= 'col' className= 'table__th note__updated'>
                            Updated
                        </th>
                        <th scope= 'col' className= 'table__th note__title'>
                            Title
                        </th>
                        <th scope= 'col' className="table__th note__username">
                            Owner
                        </th>
                        <th scope= 'col' className= 'table__th note__edit'>
                            Edit 
                        </th>

                    </tr>
                </thead>

                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}

export default NotesList