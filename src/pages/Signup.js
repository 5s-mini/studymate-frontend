import React, { useState } from 'react';
import api from '../api/api';
import { Link, useNavigate } from '../router/SimpleRouter';

function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '', nickname: '' });

    const handleChange = event => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            await api.post('/users/signup', form);
            const loginResponse = await api.post('/users/login', {
                email: form.email,
                password: form.password
            });
            const token = loginResponse?.data?.token;
            if (token) {
                localStorage.setItem('token', token);
            }
            alert('회원가입이 완료되었습니다. 바로 스터디에 참여해보세요!');
            navigate('/studies');
        } catch (err) {
            alert('회원가입 실패: ' + (err.response?.data?.message || '서버 오류'));
        }
    };

    return (
        <section className="auth-layout">
            <div className="auth-aside">
                <p className="eyebrow">회원가입</p>
                <h3>스터디메이트 합류하기</h3>
                <ul className="checklist">
                    <li>가입 즉시 데모 스터디와 마이페이지 사용 가능</li>
                    <li>관심 분야를 추가하면 추천 스터디가 더 정확해져요</li>
                    <li>작성한 스터디는 자동으로 참여 처리</li>
                </ul>
            </div>
            <div className="form-card">
                <h2>지금 바로 스터디를 시작하세요</h2>
                <p className="helper">이메일과 닉네임, 비밀번호만 입력하면 가입이 완료됩니다.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="email">이메일</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="nickname">닉네임</label>
                        <input
                            id="nickname"
                            type="text"
                            name="nickname"
                            placeholder="스터디메이트"
                            value={form.nickname}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="8자 이상 입력하세요"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="inline-actions wide">
                        <button className="button" type="submit">회원가입</button>
                        <div className="inline-actions" style={{ gap: 6 }}>
                            <Link className="nav-link" to="/login">로그인</Link>
                            <span className="muted">·</span>
                            <Link className="nav-link" to="/reset-password">비밀번호 재설정</Link>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Signup;