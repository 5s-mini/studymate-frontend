import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from '../router/SimpleRouter';

function StudyList() {
    const [studies, setStudies] = useState([]);

    useEffect(() => {
        const fetchStudies = async () => {
            try {
                const res = await api.get('/studies');
                setStudies(res.data);
            } catch (err) {
                alert('스터디 목록 불러오기 실패');
            }
        };
        fetchStudies();
    }, []);

    return (
        <div>
            <section className="hero">
                <h1>모두와 함께하는 공부, 스터디메이트</h1>
                <p>관심 있는 주제로 스터디를 만들고, 참여하고, 성장하는 경험을 시작하세요!</p>
                <div className="inline-actions" style={{ marginTop: 16 }}>
                    <Link className="button" to="/studies/new">
                        새 스터디 만들기
                    </Link>
                    <Link className="nav-link" to="/signup">
                        회원가입 후 참여하기
                    </Link>
                </div>
            </section>
            <h2 style={{ margin: '24px 0 12px' }}>스터디 목록</h2>
            {studies.length === 0 ? (
                <div className="empty-state">등록된 스터디가 아직 없어요. 첫 번째 스터디를 만들어보세요!</div>
            ) : (
                <div className="card-grid">
                    {studies.map(study => (
                        <article key={study.id} className="card">
                            <h3>{study.title}</h3>
                            <p>{study.description}</p>
                            <div className="study-meta">
                                <span>리더: {study.owner || '익명'}</span>
                                <span>멤버 {study.members?.length || 0}명</span>
                                <span>번호 #{study.id}</span>
                            </div>
                            <div className="inline-actions">
                                <Link className="button secondary" to={`/studies/${study.id}`}>
                                    상세보기
                                </Link>
                                <Link className="nav-link" to={`/studies/${study.id}/edit`}>
                                    수정
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}

export default StudyList;