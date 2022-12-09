import EditNoteForm from './EditNoteForm'

import { useParams } from "react-router-dom"

import { useGetAllNotesQuery } from './notesApiSlice'

const EditNote= ()=> {

    const { noteId }= useParams()

    const { note }= useGetAllNotesQuery(
        'notesList',
        {
            selectFromResult: ({ data })=> ({
                note: data?.entities[ noteId ]
            })
        }
    )

    const content= note 
                 ? <EditNoteForm note= {note}/>
                 : <p>Note not found!</p>

    return content

}

export default EditNote