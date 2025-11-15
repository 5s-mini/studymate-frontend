import React from 'react';
import { BrowserRouter as Router, Routes, Route } from './router/SimpleRouter';
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
                <Route path="/" element={<StudyList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/studies" element={<StudyList />} />
                <Route path="/studies/:id" element={<StudyDetail />} />
                <Route path="/studies/new" element={<StudyForm />} />
                <Route path="/studies/:id/edit" element={<StudyForm />} />
                <Route path="*" element={<StudyList />} />
            </Routes>
        </Router>
    );
}

export default App;