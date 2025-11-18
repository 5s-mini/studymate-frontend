import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/api';
import { useParams, useNavigate, Link } from '../router/SimpleRouter';

function StudyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [study, setStudy] = useState(null);
    const [me, setMe] = useState(null);
    const [joining, setJoining] = useState(false);

    const loadStudy = async () => {
        try {
            const res = await api.get(`/studies/${id}`);
            setStudy(res.data);
        } catch (err) {
            alert('스터디 정보를 불러오지 못했습니다.');
            navigate('/studies');
        }
    };

    const loadProfile = async () => {
        try {
            const res = await api.get('/users/me');
            setMe(res.data);
        } catch (error) {
            setMe(null);
        }
    };

    useEffect(() => {
        if (!id) {
            return;
        }
        loadStudy();
        loadProfile();
    }, [id]);

    const alreadyJoined = useMemo(() => {
        if (!me || !study) {
            return false;
        }
        return (me.joinedStudies || []).some(item => item.id === study.id);
    }, [me, study]);

    const isOwner = useMemo(() => {
        if (!me || !study) {
            return false;
        }
        return me.nickname === study.owner;
    }, [me, study]);

    const handleJoin = async () => {
        if (!id) {
            return;
        }
        setJoining(true);
        try {
            const res = await api.post(`/studies/${id}/join`);
            setStudy(res.data);
            await loadProfile();
            alert('스터디에 참여했습니다!');
        } catch (error) {
            if (error.response?.status === 401) {
                alert('로그인이 필요합니다. 다시 로그인해 주세요.');
                navigate('/login');
                return;
            }

            alert(error.response?.data?.message || '참여에 실패했습니다.');
        } finally {
            setJoining(false);
        }
    };

    const handleDelete = async () => {
        if (!id) {
            return;
        }

        const confirmDelete = window.confirm('정말로 이 스터디를 삭제하시겠어요?');
        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/studies/${id}`);
            alert('스터디가 삭제되었습니다.');
            navigate('/studies');
        } catch (error) {
            if (error.response?.status === 401) {
                alert('로그인이 필요합니다. 다시 로그인해 주세요.');
                navigate('/login');
                return;
            }

            alert(error.response?.data?.message || '삭제에 실패했습니다.');
        }
    };

    if (!study) {
        return <div className="empty-state">로딩 중...</div>;
    }

    return (
        <article className="form-card">
            <h2>{study.title}</h2>
            <p className="helper">{study.description}</p>
            <div className="study-meta">
                <span>스터디 번호 #{study.id}</span>
                <span>리더: {study.owner}</span>
                <span>멤버 {study.members?.length || 0}명</span>
            </div>
            <div className="chip-group" style={{ marginBottom: 12 }}>
                {(study.members || []).map(name => (
                    <span className="chip" key={name}>
                        {name}
                    </span>
                ))}
            </div>
            <div className="inline-actions" style={{ marginTop: 14 }}>
                <button className="button secondary" onClick={() => navigate('/studies')}>
                    목록으로
                </button>
                <Link className="button" to={`/studies/${id}/edit`}>
                    수정하기
                </Link>
                {isOwner && (
                    <button className="button secondary" type="button" onClick={handleDelete}>
                        스터디 삭제
                    </button>
                )}
                <button
                    className="button"
                    type="button"
                    disabled={joining || alreadyJoined}
                    onClick={handleJoin}
                >
                    {alreadyJoined ? '이미 참여 중' : joining ? '참여 중...' : '참여하기'}
                </button>
            </div>
        </article>
    );
}

export default StudyDetail;