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
            const response = await api.post('/users/login', { email, password });
            const token = response?.data?.token;
            if (token) {
                localStorage.setItem('token', token);
            }
            alert('로그인 성공');
            navigate('/studies');
        } catch (err) {
            alert('로그인 실패: ' + (err.response?.data?.message || '서버 오류'));
        }
    };

    return (
        <section className="auth-layout">
            <div className="auth-aside">
                <p className="eyebrow">StudyMate</p>
                <h3>오늘도 학습을 이어가요</h3>
                <ul className="checklist">
                    <li>진행 중인 스터디 현황을 한눈에 확인</li>
                    <li>관심사 기반 추천 스터디 준비 중</li>
                </ul>
            </div>
            <div className="form-card">
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
                            placeholder="8자 이상 입력하세요"
                            required
                        />
                    </div>
                    <div className="inline-actions wide">
                        <button className="button" type="submit">로그인</button>
                        <div className="inline-actions" style={{ gap: 6 }}>
                            <Link className="nav-link" to="/signup">회원가입</Link>
                            <span className="muted">·</span>
                            <Link className="nav-link" to="/reset-password">비밀번호 재설정</Link>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Login;