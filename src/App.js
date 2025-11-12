import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudyList from './pages/StudyList';
import StudyDetail from './pages/StudyDetail';
import StudyForm from './pages/StudyForm';
import Navbar from './components/Navbar';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/studies" element={<StudyList />} />
                <Route path="/studies/:id" element={<StudyDetail />} />
                <Route path="/create" element={<StudyForm />} />
            </Routes>
        </Router>
    );
}

export default App;