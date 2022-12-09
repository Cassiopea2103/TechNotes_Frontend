import { useNavigate, useLocation } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'

const DashFooter= ()=> {

    const navigate= useNavigate()
    const { pathname }= useLocation()

    const { username, status }= useAuth()

    const onGoHomeClicked= ()=> {
        navigate('/dash')
    }

    let goHomeButton= null 

    if (pathname !== '/dash' && pathname !== '/dash/'){
        goHomeButton=
        <button
            className= 'dash-footer__button icon-button'
            title= 'Go Home'
            onClick= {
                ()=> onGoHomeClicked()
            }
        >
            <FontAwesomeIcon
                icon= { faHouse }
            />
        </button>
    }

    const content= (
        <footer className= 'dash-footer'>
            <div className="dash-footer__container">
                <p>User: { username }</p>
                <p>Status: { status } </p>
                {goHomeButton}
            </div>
        </footer>        
    )

    return content
}

export default DashFooter