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
            alert('저장 중 오류가 발생했습니다.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={title} onChange={event => setTitle(event.target.value)} />
            <textarea value={description} onChange={event => setDescription(event.target.value)} />
            <button type="submit">저장</button>
        </form>
    );
}

export default StudyForm;