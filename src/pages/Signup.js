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
            alert('회원가입이 완료되었습니다. 로그인해 주세요.');
            navigate('/login');
        } catch (err) {
            alert('회원가입 실패: ' + (err.response?.data?.message || '서버 오류'));
        }
    };

    return (
        <section className="form-card">
            <h2>지금 바로 스터디를 시작하세요!</h2>
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
                        placeholder="8글자 이상 입력하세요"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="inline-actions">
                    <button className="button" type="submit">회원가입</button>
                    <Link className="nav-link" to="/login">이미 계정이 있나요?</Link>
                </div>
            </form>
        </section>
    );
}

export default Signup;