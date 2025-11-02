import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; 
import "../styles/Header.css"
import Sidebar from './Sidebar.jsx';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    // --- Handlers ---
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    //will use this
    // const windowWidth = window.innerWidth;

    //but for now testing:
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

// Update window width on resize
useEffect(() => {
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
}, []);

    return (
        <>
        
        <header className='header'>
            <div className="logo">
                <div className='logo-and-name'>
                    <img src="/Linkuplogo2.jpeg" alt="LinkUp logo" />
                    <span>LinkUp</span>
                </div>

            </div>
            {windowWidth > 622 && <div className="navigation">
                <NavLink to={'/'} className='nav-link'> Home </NavLink>
                <NavLink to={'/groups'} className='nav-link'> Groups </NavLink>
                <NavLink to={'/resources'} className='nav-link'> Resources </NavLink>
                <NavLink to={'/about'} className='nav-link'> About </NavLink>
            </div>}
            { windowWidth > 769 ? (
                <div className="profile">
                {console.log('authenticated: ', isAuthenticated)}
                
                    { isAuthenticated ? (
                        <>
                            <span onClick={handleLogout}>Log out</span>
                            <Link to='/profile'><span className="material-symbols-outlined"> person </span></Link>
                            
                        </>
                    ) : (
                        <>
                            <Link to='/signup'><span>Sign up</span></Link>
                            <Link to='/login'><span>Log in</span></Link>
                            <span className="material-symbols-outlined cursor-pointer"> person </span>
                        </>
                    )}
                </div>
            ) : (
                <div className='profile'>
                    <span className="material-symbols-outlined" onClick={toggleSidebar}> menu </span>
                     
                </div>
            )
            }
                
        </header>

        {windowWidth > 769 ? 
            null : 
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} toggleSidebarAction={toggleSidebar} handleLogoutAction={handleLogout} />
        }

        {windowWidth < 622 && <div className="bottom-navigation">
            <div>
                <NavLink to={'/'} className='nav-link-bottom'><span className="material-symbols-outlined">home</span>
                <span>Home</span>  
                </NavLink>
            </div>
            <div>
                <NavLink to={'/groups'} className='nav-link-bottom'> 
                    <span className="material-symbols-outlined">groups</span>
                    Groups 
                </NavLink>
            </div>
            <div>
                <NavLink to={'/resources'} className='nav-link-bottom'> 
                    <span class="material-symbols-outlined">handshake</span>
                    Resources 
                </NavLink>
            </div>
            <div>
                <NavLink to={'/about'} className='nav-link-bottom'> 
                    <span class="material-symbols-outlined">question_mark</span>
                    About 
                </NavLink>
            </div>
        </div>}

        {/* <HeaderActionPart2 /> */}
        </>
        

    );
};

export default Header;