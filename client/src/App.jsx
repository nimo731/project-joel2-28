import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Sermons from './pages/Sermons';
import Events from './pages/Events';
import About from './pages/About';
import Testimonials from './pages/Testimonials';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Admin from './pages/Admin';
import AdminSermons from './pages/AdminSermons';
import AdminEvents from './pages/AdminEvents';
import AdminPrayers from './pages/AdminPrayers';
import AdminTestimonies from './pages/AdminTestimonies';
import AdminMessages from './pages/AdminMessages';
import UserDashboard from './pages/UserDashboard';
import UserPrayers from './pages/UserPrayers';
import UserMessages from './pages/UserMessages';
import UserProfile from './pages/UserProfile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sermons" element={<Sermons />} />
            <Route path="/events" element={<Events />} />
            <Route path="/about" element={<About />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* User Dashboard */}
            <Route path="/userdashboard/*" element={<UserDashboard />} />
            <Route path="/userdashboard/prayers" element={<UserPrayers />} />
            <Route path="/userdashboard/messages" element={<UserMessages />} />
            <Route path="/userdashboard/profile" element={<UserProfile />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/sermons" element={<AdminSermons />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/prayers" element={<AdminPrayers />} />
            <Route path="/admin/testimonies" element={<AdminTestimonies />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
