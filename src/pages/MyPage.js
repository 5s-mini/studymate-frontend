import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/api';
import { Link, useNavigate } from '../router/SimpleRouter';

function MyPage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [newInterest, setNewInterest] = useState('');
    const [updating, setUpdating] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/me');
            setProfile(res.data);
        } catch (error) {
            alert('로그인이 필요합니다. 다시 로그인해 주세요.');
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleAddInterest = async event => {
        event.preventDefault();
        if (!newInterest.trim() || !profile) {
            return;
        }

        const updatedList = Array.from(new Set([...(profile.interests || []), newInterest.trim()]))
            .filter(Boolean);
        setUpdating(true);
        try {
            await api.put('/users/me', { interests: updatedList });
            setProfile({ ...profile, interests: updatedList });
            setNewInterest('');
        } catch (error) {
            alert('관심사를 저장하지 못했습니다.');
        } finally {
            setUpdating(false);
        }
    };

    const handleProfileSave = async event => {
        event.preventDefault();
        if (!profile) {
            return;
        }

        setUpdating(true);
        try {
            await api.put('/users/me', {
                bio: profile.bio,
                goals: profile.goals,
                jobTitle: profile.jobTitle
            });
            alert('프로필이 업데이트되었습니다.');
            fetchProfile();
        } catch (error) {
            alert('프로필을 저장하지 못했습니다.');
        } finally {
            setUpdating(false);
        }
    };

    const statCards = useMemo(
        () => [
            { label: '내가 만든 스터디', value: profile?.stats?.ownedCount || 0 },
            { label: '참여 중인 스터디', value: profile?.stats?.joinedCount || 0 },
            { label: '관심사', value: profile?.stats?.interestCount || 0 }
        ],
        [profile]
    );

    if (!profile) {
        return <div className="empty-state">프로필을 불러오는 중입니다...</div>;
    }

    return (
        <section className="mypage-grid">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar">{profile.nickname?.charAt(0) || 'S'}</div>
                    <div>
                        <p className="eyebrow">마이페이지</p>
                        <h2>{profile.nickname}</h2>
                        <p className="muted">{profile.email}</p>
                    </div>
                </div>
                <div className="profile-body">
                    <form onSubmit={handleProfileSave} className="profile-form">
                        <div className="form-field">
                            <label htmlFor="jobTitle">현재 역할</label>
                            <input
                                id="jobTitle"
                                value={profile.jobTitle}
                                onChange={event =>
                                    setProfile({ ...profile, jobTitle: event.target.value })
                                }
                                placeholder="예: 백엔드 개발자"
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="bio">한 줄 소개</label>
                            <input
                                id="bio"
                                value={profile.bio}
                                onChange={event => setProfile({ ...profile, bio: event.target.value })}
                                placeholder="나를 표현할 한 문장"
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="goals">올해의 목표</label>
                            <textarea
                                id="goals"
                                value={profile.goals}
                                onChange={event => setProfile({ ...profile, goals: event.target.value })}
                                placeholder="꾸준히 달성하고 싶은 학습 목표를 적어보세요."
                                rows={3}
                            />
                        </div>
                        <div className="inline-actions">
                            <button className="button" type="submit" disabled={updating}>
                                {updating ? '저장 중...' : '프로필 저장'}
                            </button>
                            <Link className="nav-link" to="/studies">
                                스터디 둘러보기
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <div className="stats-panel">
                <div className="stats-grid">
                    {statCards.map(card => (
                        <div className="stat-card" key={card.label}>
                            <p className="muted">{card.label}</p>
                            <p className="stat-value">{card.value}</p>
                        </div>
                    ))}
                </div>

                <div className="interest-card">
                    <div className="interest-header">
                        <h3>관심 분야</h3>
                        <form className="interest-form" onSubmit={handleAddInterest}>
                            <input
                                value={newInterest}
                                onChange={event => setNewInterest(event.target.value)}
                                placeholder="관심사를 추가하세요"
                            />
                            <button className="button" type="submit" disabled={updating}>
                                추가
                            </button>
                        </form>
                    </div>
                    {profile.interests?.length ? (
                        <div className="chip-group">
                            {profile.interests.map(item => (
                                <span className="chip" key={item}>
                                    {item}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">관심사를 추가하면 추천 스터디를 준비할게요.</div>
                    )}
                </div>

                <div className="panel-card">
                    <div className="panel-header">
                        <div>
                            <p className="eyebrow">내가 만든 스터디</p>
                            <h3>리더로 활동 중인 스터디</h3>
                        </div>
                        <Link className="button secondary" to="/studies/new">
                            새 스터디 만들기
                        </Link>
                    </div>
                    {profile.ownedStudies?.length ? (
                        <div className="card-grid">
                            {profile.ownedStudies.map(study => (
                                <article className="card" key={study.id}>
                                    <h3>{study.title}</h3>
                                    <p>{study.description}</p>
                                    <div className="study-meta">
                                        <span>번호 #{study.id}</span>
                                        <span>멤버 {study.members?.length || 0}명</span>
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
                    ) : (
                        <div className="empty-state">아직 만든 스터디가 없어요.</div>
                    )}
                </div>

                <div className="panel-card">
                    <div className="panel-header">
                        <div>
                            <p className="eyebrow">참여 중인 스터디</p>
                            <h3>함께 학습하는 목록</h3>
                        </div>
                        <Link className="nav-link" to="/studies">
                            모든 스터디 보기
                        </Link>
                    </div>
                    {profile.joinedStudies?.length ? (
                        <div className="card-grid">
                            {profile.joinedStudies.map(study => (
                                <article className="card" key={study.id}>
                                    <h3>{study.title}</h3>
                                    <p>{study.description}</p>
                                    <div className="study-meta">
                                        <span>리더: {study.owner}</span>
                                        <span>멤버 {study.members?.length || 0}명</span>
                                    </div>
                                    <div className="inline-actions">
                                        <Link className="button secondary" to={`/studies/${study.id}`}>
                                            상세보기
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">참여 중인 스터디가 없습니다. 새로 참여해 보세요!</div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default MyPage;