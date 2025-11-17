import React, { useState } from 'react';
import api from '../api/api';
import { Link, useNavigate } from '../router/SimpleRouter';

function ResetPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async event => {
        event.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/users/reset-password', {
                email,
                nickname,
                newPassword
            });
            const token = res?.data?.token;
            if (token) {
                localStorage.setItem('token', token);
            }
            alert(res?.data?.message || '비밀번호가 재설정되었습니다.');
            navigate('/studies');
        } catch (error) {
            alert(error.response?.data?.message || '재설정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-layout">
            <div className="auth-aside">
                <p className="eyebrow">비밀번호 재설정</p>
                <h3>가입 정보로 새 비밀번호를 설정하세요</h3>
                <ul className="checklist">
                    <li>가입한 이메일과 이름(닉네임)을 입력하세요.</li>
                    <li>새 비밀번호는 로그인과 동일하게 사용됩니다.</li>
                    <li>재설정 후 바로 로그인 상태로 이동합니다.</li>
                </ul>
            </div>
            <div className="form-card">
                <h2>비밀번호를 잊으셨나요?</h2>
                <p className="helper">가입 시 사용한 이메일과 이름, 새 비밀번호를 입력해 주세요.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="reset-email">이메일</label>
                        <input
                            id="reset-email"
                            type="email"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="reset-nickname">이름(닉네임)</label>
                        <input
                            id="reset-nickname"
                            type="text"
                            value={nickname}
                            onChange={event => setNickname(event.target.value)}
                            placeholder="가입 시 적은 이름"
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="reset-password">새 비밀번호</label>
                        <input
                            id="reset-password"
                            type="password"
                            value={newPassword}
                            onChange={event => setNewPassword(event.target.value)}
                            placeholder="8자 이상 입력하세요"
                            required
                        />
                    </div>
                    <div className="inline-actions wide">
                        <button className="button" type="submit" disabled={loading}>
                            {loading ? '재설정 중...' : '비밀번호 재설정'}
                        </button>
                        <Link className="nav-link" to="/login">
                            로그인으로 돌아가기
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default ResetPassword;