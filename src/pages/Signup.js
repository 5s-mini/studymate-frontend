import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from '../router/SimpleRouter';

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
            alert('회원가입이 완료되었습니다.');
            navigate('/login');
        } catch (err) {
            alert('회원가입 실패: ' + (err.response?.data?.message || '서버 오류'));
        }
    };

    return (
        <div>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="이메일"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    type="text"
                    name="nickname"
                    placeholder="닉네임"
                    value={form.nickname}
                    onChange={handleChange}
                    required
                />
                <br />
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}

export default Signup;