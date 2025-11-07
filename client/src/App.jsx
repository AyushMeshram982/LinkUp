import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Header from './components/Header.jsx';
import EventsPage from './pages/EventsPage.jsx';

import GroupsPage from './pages/GroupsPage.jsx'
import ResourcesPage from './pages/ResourcesPage.jsx';
import EventDetailPage from './pages/EventDetailPage.jsx';
import ResourceDetailPage from './pages/ResourceDetailPage.jsx';
import HostDashboardPage from './pages/HostDashboardPage.jsx';

import QrScanner from './pages/QrScannerPage.jsx'

import CheckinScannerPage from './pages/CheckinScannerPage.jsx'; // <-- NEW IMPORT
import CheckinStatusPage from './pages/CheckinStatusPage.jsx';

import CreateEventPage from "./pages/CreateEventPage.jsx"
import CreateGroupPage from './pages/CreateGroupPage.jsx';
import PostResourcePage from './pages/PostResourcePage.jsx';

function App() {

  return (
    
    <div className='App bg-black min-h-screen'>
      <Header />
    {/* <div className='App '>  */}
      {/* <main className="max-w-7xl mx-auto p-4"> */}
       

        <Routes>

          {/* user Auth/Profile routes */}
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/login' element={<LoginPage />} />
         
          <Route path="/" element={< EventsPage />} />
          <Route path="/events/:id" element={< EventDetailPage />} />

          <Route path="/groups" element={< GroupsPage />} />
          <Route path="/resources" element={< ResourcesPage />} />
          <Route path="/resources/:id" element={< ResourceDetailPage />} />
         
          <Route path="/host/dashboard" element={< HostDashboardPage />} />

          {/* 404 catch-all */}
          {/* path="*" - page not found */}

          {/* <Route path="/qrscan" element={< QrScanner />} /> */}

          {/* Check-in Scanner Path: Used when host clicks 'Check-in' for a specific event */}
                <Route path="/host/checkin/:eventId" element={<CheckinScannerPage />} /> 
                
                {/* Check-in Status Route: Used for immediate feedback after scanning */}
                <Route path="/checkin/status" element={<CheckinStatusPage />} />

              <Route path="/create-event" element={<CreateEventPage />} />
              <Route path="/create-group" element={<CreateGroupPage />} />
              <Route path="/post-resource" element={<PostResourcePage />} />
               
        </Routes>
      {/* </main> */}
    </div>
    
  )
}

export default App
