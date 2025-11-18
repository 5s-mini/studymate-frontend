import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from './router/SimpleRouter';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudyList from './pages/StudyList';
import StudyDetail from './pages/StudyDetail';
import StudyForm from './pages/StudyForm';
import Navbar from './components/Navbar';
import MyPage from './pages/MyPage';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';
import Support from './pages/Support';

function App() {
    return (
        <Router>
            <div className="app-shell">
                <Navbar />
                <main className="page-content">
                    <Routes>
                        <Route path="/" element={<StudyList />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/studies" element={<StudyList />} />
                        <Route path="/studies/:id" element={<StudyDetail />} />
                        <Route path="/studies/new" element={<StudyForm />} />
                        <Route path="/studies/:id/edit" element={<StudyForm />} />
                        <Route path="/mypage" element={<MyPage />} />
                        <Route path="*" element={<StudyList />} />
                    </Routes>
                </main>
                <div className="footer">StudyMate · 함께 성장하는 스터디 커뮤니티</div>
            </div>
        </Router>
    );
}

export default App;