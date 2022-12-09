import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { useUpdateNoteMutation, useDeleteNoteMutation } from './notesApiSlice'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'

import { useAuth } from '../../hooks/useAuth'

const EditNoteForm= ({ note })=> {

    const { isAdmin, isManager }= useAuth()

    const navigate= useNavigate()

    const [
        updateNote,
        {
            isLoading: isUpdateLoading,
            isSuccess: isUpdateSuccess,
            isError: isUpdateError,
            error: updateError
        }
    ]= useUpdateNoteMutation()

    const [
        deleteNote,
        {
            isLoading: isDeleteLoading,
            isSuccess: isDeleteSuccess,
            isError: isDeleteError,
            error: deleteError
        }
    ]= useDeleteNoteMutation()

    const [ title, setTitle ]= useState(note.title)
    const [ body, setBody ]= useState(note.body)
    const [ completed, setCompleted ]= useState(note.completed)

    const onTitleChange= e=> setTitle(e.target.value)
    const onBodyChange= e=> setBody(e.target.value)
    const onCompletedChange= ()=> setCompleted(previous=> !previous)

    // check update or delete request success status and redirect user to /dash/notes 
    useEffect(
        ()=> {
            if (isUpdateSuccess || isDeleteSuccess ){
                setTitle('')
                setBody('')
                navigate('/dash/notes')
            }
        },
        [ isUpdateSuccess, isDeleteSuccess, navigate ]
    )

    const onUpdateNoteClicked= async()=> {
        await updateNote({ id: note.id, user: note.user, title, body, completed })
    }

    const onDeleteNoteClicked= async()=> {
        await deleteNote({ id: note.id })
    }

    const canUpdate= [ title, body ].every(Boolean) && !isUpdateLoading 

    const errClass= (isUpdateError || isDeleteError)? 'errMsg': 'offscreen'
    const validTitleClass= !title? 'form__input--incomplete': ''
    const validBodyClass= !body? 'form__input--incomplete': ''
    
    const errorContent= (updateError?.data?.message || deleteError?.data?.message) ?? ''

    let deleteButton 
    if ( isManager || isAdmin ){
        deleteButton= (
            <button
                className= 'icon-button'
                title= 'Delete Note'
                disabled= { isDeleteLoading }
                onClick= { onDeleteNoteClicked }
            >
                <FontAwesomeIcon
                    icon= { faTrashCan }
                />
            </button>
        )
    }

    const content= (
        <>
            <p className= { errClass }>{ errorContent }</p>
            
            <form
                className= 'form'
                onSubmit= { (e)=> e.preventDefault() }
            >
                <div className="form__title-row">
                    <h2>Edit Note</h2>
                    <div className="form__action-buttons">
                        <button
                            className= 'icon-button'
                            title= 'Update Note'
                            disabled= { !canUpdate }
                            onClick= { onUpdateNoteClicked }
                        >
                            <FontAwesomeIcon
                                icon= { faSave }
                            />
                        </button>

                        { deleteButton }
                    </div>
                </div>

                <label htmlFor="title" className= 'form__label'>
                    Title
                </label>
                <input 
                    type="text" 
                    name= 'title'
                    id= 'title'
                    value= {title}
                    onChange= { onTitleChange }
                    autoComplete= 'off'
                    className= {`form__input ${ validTitleClass }`}
                />

                <label htmlFor="body" className= 'form__label'>
                    Body
                </label>
                <textarea
                    id= 'body'
                    name= 'body'
                    className= {`form__input form__input--text ${ validBodyClass }`}
                    value= { body }
                    onChange= { onBodyChange }
                />

                <label htmlFor="completed" className= 'form__label'>
                    <input 
                        name= 'completed'
                        id= 'completed'
                        className= {`form__checkbox`}
                        type="checkbox" 
                        checked= { completed }
                        onChange= { onCompletedChange }
                    />
                    Completed
                </label>

            </form>
        </>
    )

    return content
}

export default EditNoteForm