import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Header from './components/Header.jsx';
import EventsPage from './pages/EventsPage.jsx';
import DiscoverySection from './components/DiscoverySection.jsx';

import Cal from "./components/Cal.jsx"


function App() {

  return (
    <div className='App bg-black min-h-screen'>
    {/* <div className='App '> */}
      <Header />
      <main className="max-w-7xl mx-auto p-4">
       

        <Routes>

          {/* user Auth/Profile routes */}
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/login' element={<LoginPage />} />
          {/* /profile -  profile page */}

          <Route path="/" element={< EventsPage />} />
          {/* <Route path="/" element={< EventsPage2 />} />
          <Route path="/event" element={< EventsPage />} /> */}
          {/* /groups -  groups page */}
          {/* /resources -  resources page */}
          {/* /about -  about page */}
          <Route path="/dis" element={< DiscoverySection />} />

          {/* 404 catch-all */}
          {/* path="*" - page not found */}

        </Routes>
      </main>
    </div>
  )
}

export default App
