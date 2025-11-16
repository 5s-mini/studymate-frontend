import React, { useState } from 'react';
import api from '../api/api';
import { Link, useNavigate } from '../router/SimpleRouter';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async event => {
        event.preventDefault();
        try {
            await api.post('/users/login', { email, password });
            alert('로그인 성공');
            navigate('/studies');
        } catch (err) {
            alert('로그인 실패: ' + (err.response?.data?.message || '서버 오류'));
        }
    };

    return (
        <section className="form-card">
            <h2>다시 만나 반가워요!</h2>
            <p className="helper">스터디에 참여하려면 이메일과 비밀번호를 입력하세요.</p>
            <form onSubmit={handleLogin}>
                <div className="form-field">
                    <label htmlFor="email">이메일</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="password">비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>
                <div className="inline-actions">
                    <button className="button" type="submit">로그인</button>
                    <Link className="nav-link" to="/signup">아직 계정이 없나요?</Link>
                </div>
            </form>
        </section>
    );
}

export default Login;