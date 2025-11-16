import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useParams, useNavigate, Link } from '../router/SimpleRouter';

function StudyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [study, setStudy] = useState(null);

    useEffect(() => {
        const fetchStudy = async () => {
            try {
                const res = await api.get(`/studies/${id}`);
                setStudy(res.data);
            } catch (err) {
                alert('스터디 정보를 불러오지 못했습니다.');
                navigate('/studies');
            }
        };

        if (id) {
            fetchStudy();
        }
    }, [id, navigate]);

    if (!study) {
        return <div className="empty-state">로딩 중...</div>;
    }

    return (
        <article className="form-card">
            <h2>{study.title}</h2>
            <p className="helper">{study.description}</p>
            <div className="study-meta">
                <span>스터디 번호 #{study.id}</span>
                {study.owner && <span>리더: {study.owner}</span>}
            </div>
            <div className="inline-actions" style={{ marginTop: 14 }}>
                <button className="button secondary" onClick={() => navigate('/studies')}>
                    목록으로
                </button>
                <Link className="button" to={`/studies/${id}/edit`}>
                    수정하기
                </Link>
            </div>
        </article>
    );
}

export default StudyDetail;