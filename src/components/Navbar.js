import React from 'react';
import { Link, useNavigate } from '../router/SimpleRouter';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="navbar">
            <Link to="/" className="nav-brand">
                <span className="nav-brand-mark">S</span>
                <span>StudyMate</span>
            </Link>
            <div className="nav-links">
                <Link className="nav-link" to="/studies">
                    스터디
                </Link>
                <Link className="nav-link" to="/mypage">
                    마이페이지
                </Link>
                <Link className="nav-link" to="/reset-password">
                    비밀번호 재설정
                </Link>
                <Link className="nav-link" to="/about">
                    서비스 소개
                </Link>
                <Link className="nav-link" to="/support">
                    지원 센터
                </Link>
                {token ? (
                    <>
                        <button className="button secondary" onClick={handleLogout}>
                            로그아웃
                        </button>
                    </>
                ) : (
                    <>
                        <Link className="nav-link" to="/login">
                            로그인
                        </Link>
                        <Link className="button" to="/signup">
                            시작하기
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}

export default Navbar;