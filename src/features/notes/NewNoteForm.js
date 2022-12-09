import { useState, useEffect } from "react"

import { useNavigate } from "react-router-dom"

import { useCreateNoteMutation } from "./notesApiSlice"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"

const NewNoteForm=({ users })=> {

    const navigate= useNavigate()

    const [
        createNote,
        {
            isLoading,
            isSuccess,
            isError,
            error
        }
    ]= useCreateNoteMutation()
    
    const [ title, setTitle ]= useState('')
    const [ body, setBody ]= useState('')
    const [ user, setUser ]=  useState('')

    const onTitleChange= e=> setTitle(e.target.value)
    const onBodyChange= e=> setBody(e.target.value)
    const onUserChange= e=> setUser(e.target.value)
    
    const userOptions= users.map((user)=> {
        return (
            <option 
                value={ user.id }
                key= { user.id }
            >
                {user.username}
            </option>
        )
    })

    const canSave= [ title, body, user ].every(Boolean) && !isLoading 

    // check request success status and send user back to /dash/notes 
    useEffect(
        ()=> {
            if ( isSuccess ){
                setTitle('')
                setBody('')
                setUser('')
                navigate('/dash/notes')
            }
        },
        [ isSuccess, navigate ]
    )

    const onSaveNoteClicked= async()=> {
        await createNote({ user, title, body })
    }

    const errClass= isError? 'errMsg': 'offscreen'
    const validTitleClass= !title? 'form__input--incomplete': ''
    const validBodyClass= !body? 'form__input--incomplete': ''

    const content= (
        <>
            <p className= {errClass}>{error?.data?.message}</p>

            <form
                 onSubmit= { e=> e.preventDefault() }
                className= 'form'     
            >
                <div className="form__title-row">
                    <h1>New Note</h1>
                    <div className="form__action-buttons">
                        <button
                            className= 'form__button icon-button'
                            title= 'Save Note'
                            disabled= { !canSave }
                            onClick= { onSaveNoteClicked }
                        >
                            <FontAwesomeIcon
                                icon= { faSave }
                            />
                        </button>
                    </div>
                </div>

                <select 
                    name="user" 
                    id="user"
                    className= 'form__select'
                    value= { user }
                    onChange= { onUserChange }
                >
                    <option value="">Note Owner</option>
                    { userOptions }
                </select>

                <label htmlFor="title" className= 'form__label'>
                    Title
                </label>
                <input 
                    type="text" 
                    name="title"
                    id= 'title'
                    value= { title }
                    onChange= { onTitleChange }
                    className= {`form__input ${ validTitleClass }`}
                    autoComplete= 'off'
                />

                <label htmlFor="body" className= 'form__label'>
                    Body
                </label>
                <textarea
                    name="body" 
                    id="body"
                    className= {`form__input form__input--text ${ validBodyClass }`}
                    rows= '5' 
                    value= { body }
                    onChange= { onBodyChange }
                />

            </form>
        </>
    )

    return content
}

export default NewNoteForm