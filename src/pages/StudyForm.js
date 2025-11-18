import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate, useParams } from '../router/SimpleRouter';

function StudyForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchStudy = async () => {
            try {
                const res = await api.get(`/studies/${id}`);
                setTitle(res.data.title);
                setDescription(res.data.description);
            } catch (err) {
                alert('스터디 정보를 불러오지 못했습니다.');
            }
        };

        fetchStudy();
    }, [id]);

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            const payload = { title, description };
            if (id) {
                await api.put(`/studies/${id}`, payload);
            } else {
                await api.post('/studies', payload);
            }
            navigate('/studies');
        } catch (err) {
            if (err.response?.status === 401) {
                alert('로그인이 필요합니다. 다시 로그인해 주세요.');
                navigate('/login');
                return;
            }

            alert('저장 중 오류가 발생했습니다.');
        }
    };

    return (
        <section className="form-card">
            <h2>{id ? '스터디 수정' : '새 스터디 만들기'}</h2>
            <p className="helper">스터디의 목적과 운영 방식을 간단히 작성해 주세요.</p>
            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="title">제목</label>
                    <input
                        id="title"
                        value={title}
                        onChange={event => setTitle(event.target.value)}
                        placeholder="예: 프론트엔드 면접 스터디"
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="description">소개</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={event => setDescription(event.target.value)}
                        placeholder="어떤 목표로 진행하는지, 주기와 방식 등을 적어주세요."
                        required
                    />
                </div>
                <div className="inline-actions">
                    <button className="button" type="submit">저장하기</button>
                    <button
                        className="button secondary"
                        type="button"
                        onClick={() => navigate('/studies')}
                    >
                        취소
                    </button>
                </div>
            </form>
        </section>
    );
}

export default StudyForm;