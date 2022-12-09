import { useState, useEffect } from "react"

import { useNavigate } from "react-router-dom"

import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"

import { ROLES } from "../../config/roles"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'

const EditUserForm= ({ user })=> {
    
    const navigate= useNavigate()

    const [
        updateUser,
        {
            isLoading,
            isSuccess,
            isError,
            error
        }
    ]= useUpdateUserMutation()

    const [
        deleteUser,
        {
            isLoading: isDeleteLoading,
            isSuccess: isDeleteSuccess,
            isError: isDeleteError,
            error: deleteError
        }
    ]= useDeleteUserMutation()

    const USERNAME_REGEX= /^[A-z0-9]{6,14}$/
    const PASSWORD_REGEX= /^[A-z0-9!@#$%]{8,16}$/

    const [ username, setUsername ]= useState( user.username )
    const [ validUsername, setValidUsername ]= useState( false )
    const [ password, setPassword ]= useState('')
    const [ validPassword, setValidPassword ]= useState( false )
    const [ roles, setRoles ]= useState( user.roles)
    const [ active, setActive ]= useState( user.active )

    const onUsernameChange= e=> setUsername(e.target.value)
    const onPasswordChange= e=> setPassword(e.target.value)
    const onRolesChange= e=> {
        const selectedRolesValues= Array.from(
            e.target.selectedOptions,
            selectedOption=> selectedOption.value
        )
        setRoles(selectedRolesValues)
    }
    const onActiveChange= ()=> setActive (previous=> !previous) 

    // check username validity: 
    useEffect(
        ()=> {
            setValidUsername(USERNAME_REGEX.test(username))
        }, 
        // eslint-disable-next-line
        [ username ]
    )

    // check password validity: 
    useEffect(
        ()=> {
            setValidPassword(PASSWORD_REGEX.test(password))
        }, 
        // eslint-disable-next-line
        [ password ]
    )

    const userRolesOptions= Object.values(ROLES).map((role)=>{
        return (
            <option 
                value= { role }
                key= { role }
            >
                { role }
            </option>
        )
    })

    // checking if request are successful and sending user back to /dash/users
    useEffect(
        ()=> {
            if ( isSuccess || isDeleteSuccess ){
                setUsername('')
                setPassword('')
                setRoles([])
                navigate('/dash/users')
            }
        }, 
        [ isSuccess, isDeleteSuccess, navigate ]
    )

    let canSave 
    const canDelete= !isDeleteLoading
    if ( password ){
        canSave= [ validUsername, validPassword, roles.length].every(Boolean) && !isLoading
    }
    else{ 
        canSave= [ validUsername, roles.length].every(Boolean) && !isLoading
    }

    const onSaveUserClicked= async()=> {

        if ( password ){
            await updateUser({ id: user.id, username, password, roles, active })
        }
        else {
            await updateUser({ id: user.id, username, roles, active })
        }
    }

    const onDeleteUserClicked= async()=> {
        await deleteUser({ id: user.id })
    }

    // classes: 
    const errClass= ( isError|| isDeleteError ) ? 'errMsg': 'offscreen'
    const validUserClass= !validUsername ? 'form__input--incomplete': ''
    const validPasswordClass= (password && !validPassword) ? 'form__input--incomplete': ''
    const validRolesClass= !Boolean(roles.length)? 'form__input--incomplete': '' 

    const errorContent= (error?.data?.message || deleteError?.data?.message) ?? ''
    
    const content= (
        <>
            <p className= {errClass}>{errorContent}</p>

            <form className= 'form' onSubmit= { e=> e.preventDefault() }>
                <div className="form__titl-row">
                    <h2>Edit User</h2>
                    <div className="form__action-buttons">
                        <button
                            className= 'icon-button'
                            title= 'Update User'
                            onClick= { onSaveUserClicked }
                            disabled= { !canSave }
                        >
                            <FontAwesomeIcon
                                icon= { faSave }
                            />
                        </button>
                        <button
                            className= 'icon-button'
                            title= 'Delete User'
                            onClick= { onDeleteUserClicked }
                            disabled= { !canDelete }
                        >
                            <FontAwesomeIcon
                                icon= { faTrashCan }
                            />
                        </button>
                    </div>
                </div>

                <label htmlFor="username" className= 'form__label'>
                    Username <span className= 'nowrap'>6-14 letters, numbers allowed</span>
                </label>
                <input 
                    type="text" 
                    id="username"
                    className= {`form__input ${validUserClass}`}
                    autoComplete= 'off'
                    value= { username }
                    onChange= { onUsernameChange }
                />

                <label htmlFor="password">
                    Password 
                    <span className= 'nowrap'>
                        8-16 letters. Cap, numbers, specials chars allowed! 
                        Leave empty for no changes
                    </span>
                </label>
                <input 
                    type="text" 
                    name= 'password'
                    id= 'password'
                    className= {`form__input ${validPasswordClass}`}
                    autoComplete= 'off'
                    value= { password }
                    onChange= { onPasswordChange }
                />

                <label htmlFor="roles" className= 'form__label'>
                    Roles
                </label>
                <select 
                    name="roles" 
                    id="roles"
                    className= {`form__select ${ validRolesClass }`}
                    value= { roles }
                    onChange= { onRolesChange } 
                    multiple= { true }  
                    size= '4' 
                >
                    <option value="">Select User Roles</option>
                    { userRolesOptions }
                </select>

                <label htmlFor="active" className= 'form__label'>
                    <input 
                        type="checkbox" 
                        className= {`form__checkbox`}
                        id= 'active'
                        name= 'active'
                        checked= { active }
                        onChange= { onActiveChange }
                    />
                    Active
                </label>
            </form>
        </>
    )

    return content
}

export default EditUserForm