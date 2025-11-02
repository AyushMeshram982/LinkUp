import React from 'react'
import "../styles/Sidebar.css"
import { useAuth } from '../contexts/AuthContext.jsx';
import { Link } from 'react-router-dom';


const Sidebar = ({isSidebarOpen, toggleSidebarAction, handleLogoutAction}) => {

    const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-close'}`}>
        <span className={`material-symbols-outlined sidebar-close-button`} onClick={toggleSidebarAction}>close</span>

        { isAuthenticated ? (
            <div className='profile-and-log-out signup-and-login'>
                <Link to='/profile' onClick={toggleSidebarAction}><span>profile</span></Link>
                <span onClick={handleLogoutAction}>Log out</span>
            </div>

        ) : (
            <div className='signup-and-login'>
                <Link to='/signup'onClick={toggleSidebarAction}><span>Sign up</span></Link>
                <Link to='/login' onClick={toggleSidebarAction}><span>Log in</span></Link>
            </div>
        )

        }
      
    </div>
  )
}

export default Sidebar
