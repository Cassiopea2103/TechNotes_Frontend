import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { useCreateUserMutation } from './usersApiSlice'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'

import { ROLES } from '../../config/roles'

const NewUserForm= ()=> {

    const navigate= useNavigate()
    
    const [
        createUser,
        {
            isLoading,
            isSuccess,
            isError,
            error
        }
    ]= useCreateUserMutation()

    const USERNAME_REGEX= /^[A-z0-9]{6,14}$/
    const PASSWORD_REGEX= /^[A-z0-9!@#$%]{8,16}$/

    const [ username, setUsername ]= useState('')
    const [ validUsername, setValidUsername ]= useState(false)
    const [ password, setPassword ]= useState('')
    const [ validPassword, setValidPassword ]= useState(false)
    const [ roles, setRoles ]= useState(['Employee'])
    
    const onUsernameChange= e=> setUsername(e.target.value)
    const onPasswordChange= e=> setPassword(e.target.value)
    const onRolesChange= e=> {
        const selectedRolesValues= Array.from(
            e.target.selectedOptions, // HTML collection
            selectedOption=> selectedOption.value 
        )

        setRoles(selectedRolesValues)
    }

    // rolesOptions: 
    const rolesOptions= Object.values(ROLES).map((role)=> {
        return (
            <option 
                value= { role }
                key= { role }
            >
                { role }
            </option>
        )
    })

    // canSave condition:
    const canSave= [ validUsername, validPassword, roles.length ].every(Boolean) && !isLoading

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

    // check for create user success | navigate to /dash 
    useEffect(
        ()=> {
            if ( isSuccess ){
                setUsername('')
                setPassword('')
                setRoles('')
                navigate('/dash/users')
            }
        }, 
        [ isSuccess, navigate ]
    )

    // create User function: 
    const onSaveUserClicked= async(e)=> {
        e.preventDefault()
        await createUser({ username, password, roles })
    }

    // classes: 
    const errClass= isError? 'errMsg': 'offscreen'
    const validUserClass= !validUsername? 'form__input--incomplete': ''
    const validPasswordClass= !validPassword? 'form__input--incomplete': ''
    const validRolesClass= !Boolean(roles.length)? 'form__input--incomplete': ''

    const content= (
        <>
            <p className= {errClass}>{ error?.data?.message }</p>

            <form className= 'form' onSubmit= { onSaveUserClicked }>
                <div className="form__title-row">
                    <h2>New User</h2>
                    <div className="form__action-buttons">
                        <button
                            className= 'icon-button'
                            title= 'Save User'
                            disabled= {!canSave}
                        >
                            <FontAwesomeIcon
                                icon={ faSave }
                            />
                        </button>
                    </div>
                </div>

                <label className= 'form__label' htmlFor="username">
                    Username <span className= 'nowrap'>6- 14 characters </span>
                </label>
                <input 
                    className= {`form__input ${validUserClass}`}
                    id= 'username'
                    name= 'username'
                    type="text" 
                    value= { username }
                    onChange= { onUsernameChange }
                    autoComplete= 'off'
                />

                <label className= 'form__label' htmlFor="password">
                    Password 
                    <span className= 'nowrap'>
                        8-16 characters. !@#$%$ included. Caps included
                    </span>
                </label>
                <input 
                    type="text" 
                    className= {`form__input ${validPasswordClass}`}
                    id= 'password'
                    name= 'password'
                    value= { password }
                    onChange= { onPasswordChange }
                    autoComplete= 'off'    
                />

                <label className= 'form__label' htmlFor="roles">Roles</label>
                <select 
                    id="roles"
                    className= {`form__select ${validRolesClass}`}
                    multiple= {true}
                    value= { roles }
                    onChange= { onRolesChange }
                    name= 'roles'
                    size= '4'
                >
                    <option value="">Choose roles </option>
                    { rolesOptions }
                </select>
            </form>
        </>
    )

    return content
}

export default NewUserForm