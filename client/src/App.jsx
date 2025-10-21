import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import SignUpPage from './pages/SignUpPage.jsx';

function App() {

  return (
    <div className='App'>

      <Routes>

        {/* <Route path='/' element={<HomePage />} />  */}
        {/* /groups -  groups page */}
        {/* /resources -  resources page */}
        {/* /about -  about page */}


        {/* user Auth/Profile routes */}
        <Route path='/signup' element={<SignUpPage />} />
        {/* /login -  login page */}
        {/* /profile -  profile page */}


        {/* 404 catch-all */}
        {/* path="*" - page not found */}



      


      </Routes>
      
    </div>
  )
}

export default App
