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
        <nav>
            <Link to="/">홈</Link> |{' '}
            {token ? (
                <>
                    <button onClick={handleLogout}>로그아웃</button>
                </>
            ) : (
                <>
                    <Link to="/login">로그인</Link> | <Link to="/signup">회원가입</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar;