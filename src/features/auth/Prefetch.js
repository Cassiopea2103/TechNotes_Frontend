import { store } from '../../app/store'

import { usersApiSlice } from '../users/usersApiSlice'
import { notesApiSlice } from '../notes/notesApiSlice'

import { useEffect } from 'react'

import { Outlet } from 'react-router-dom'

const Prefetch= ()=> {

    useEffect(
        ()=> {
            
            store.dispatch( notesApiSlice.util.prefetch('getAllNotes', 'notesList', { force: true}))
            store.dispatch( usersApiSlice.util.prefetch( 'getAllUsers', 'usersList', { force: true}))
            
        }, 
        []
    )

    return <Outlet/>
}

export default Prefetch