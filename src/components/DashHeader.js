import { Link, useNavigate, useLocation } from "react-router-dom";

import {  useEffect } from 'react'

import { useAuth } from "../hooks/useAuth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faRightFromBracket,
    faFileCirclePlus,
    faFilePen,
    faUserGear,
    faUserPlus
} from "@fortawesome/free-solid-svg-icons";

import { useSendLogoutMutation } from "../features/auth/authApiSlice";

const DashHeader= ()=> {

    const { isManager, isAdmin }= useAuth()

    const [
        sendLogout,
        {
            isLoading,
            isSuccess,
            isError,
            error
        }
    ]= useSendLogoutMutation()

    const navigate= useNavigate()

    const onNewUserClicked= ()=> navigate('/dash/users/new')
    const onNewNoteClicked= ()=> navigate('/dash/notes/new')
    const onUsersClicked= ()=> navigate('/dash/users')
    const onNotesClicked= ()=> navigate('/dash/notes')

    const { pathname }= useLocation()

    const DASH_REGEX= /^\/dash(\/)?$/
    const NOTES_REGEX= /^\/dash\/notes(\/)?$/
    const USERS_REGEX= /^\/dash\/users(\/)?$/

    useEffect(
        ()=> {
            if ( isSuccess ){
                navigate('/')
            }
        },
        [ isSuccess, navigate ]
    )

    if ( isLoading ) return <p>Loading...</p>

    if ( isError ) return <p>Error: { error.message } </p>

    let dashClass= null 

    const pathCondition= !DASH_REGEX.test( pathname ) && (NOTES_REGEX.test(pathname)
                        || USERS_REGEX.test( pathname ))
    
    if ( !pathCondition ) {
        dashClass= 'dash-header__container--small'
    }

    const errClass= isError ? 'errmsg': 'offscreen'

    let newNoteButton= null 
    if ( NOTES_REGEX.test( pathname )){
        newNoteButton= (
            <button
                className="icon-button"
                title= { ' New Note '}
                onClick= { onNewNoteClicked }
            >
                <FontAwesomeIcon
                    icon= { faFileCirclePlus }
                />
            </button>
        )
    }

    let newUserButton= null 
    if ( isManager || isAdmin ){
        if ( USERS_REGEX.test ( pathname )){
            newUserButton= (
                <button
                    className= 'icon-button'
                    title= "New User"
                    onClick= { onNewUserClicked }
                >
                    <FontAwesomeIcon
                        icon= { faUserPlus }
                    />
                </button>
            )
        }
    }

    let notesButton= null 
    if (!NOTES_REGEX.test( pathname ) && pathname.includes('/dash')){
        notesButton= (
            <button
                className= 'icon-button'
                title= "View Notes"
                onClick= { onNotesClicked }
            >
                <FontAwesomeIcon
                    icon= { faFilePen }
                />
            </button>
        )
    }

    let usersButton= null 
    if ( isManager || isAdmin ){
        if ( !USERS_REGEX.test( pathname ) && pathname.includes('/dash')){
            usersButton= (
                <button
                    className= 'icon-button'
                    title= 'View Users'
                    onClick= { onUsersClicked }
                >
                    <FontAwesomeIcon
                        icon= { faUserGear }
                    />
                </button>
            )
        }
    }

    const logoutButton= (
        <button
            className= 'icon-button'
            title= 'Logout'
            onClick= { ()=>sendLogout() }
        >
            <FontAwesomeIcon
                icon= { faRightFromBracket }
            />
        </button>
    )

    let buttonContent= null 

    if ( isLoading ){
        buttonContent= (
            <p>Loading...</p>
        )
    }
    else { 
        buttonContent= (
            <>
                { notesButton }
                { newNoteButton }
                { newUserButton }
                { usersButton }
                { logoutButton }
            </>
        )
    }

    const content= (
        <>
            <p
                className= {`${ errClass }`}
            >
                { error?.data?.message }
            </p>
            <header className={`dash-header`}>
                <div className={`dash-header__container ${ dashClass }`}>
                    <h1>
                        <Link to={'/dash'}>
                            TechNotes
                        </Link>
                    </h1>
                    
                    <nav className= 'dash-header__nav'>
                        { buttonContent }
                    </nav>
                </div>
            </header>
        </>
    )

    return content
}

export default DashHeader