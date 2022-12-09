import { useGetAllUsersQuery } from "./usersApiSlice"

import { useNavigate } from "react-router-dom"

import { memo } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"

const User= ({ userId })=> {

    const navigate= useNavigate()

    const { user } = useGetAllUsersQuery(
        'usersList',
        {
            selectFromResult: ({ data })=> ({
                user: data?.entities[ userId ]
            })
        }
    )

    if ( user ){

        const handleEdit= ()=> navigate(`/dash/users/edit/${userId}`)
        
        const userRolesString= user.roles.toString().replaceAll(',', '- ')

        const cellStatus= user.active? '' : 'table__cell--inactive'

        const userRow= (
            <tr className= 'table__row user'>

                <td className= {`table__cell ${cellStatus}`}>
                    {user.username}
                </td>
                <td className= {`table__cell ${cellStatus}`}>
                    {userRolesString}
                </td>
                <td className= {`table__cell ${cellStatus}`}>
                    <button
                        className= 'table__button icon-button'
                        title= 'Edit User'
                        onClick={ handleEdit }
                    >
                        <FontAwesomeIcon
                            icon= { faPenToSquare }
                        />
                    </button>
                </td>

            </tr>
        )

        return userRow
    }
    else {
        return null
    }
}

const memoizedUser= memo( User )

export default memoizedUser