import React from 'react';
import { Link } from '../router/SimpleRouter';

function About() {
    return (
        <section className="form-card" style={{ maxWidth: '980px' }}>
            <p className="eyebrow">서비스 소개</p>
            <h2>StudyMate를 소개합니다.</h2>
            <p className="helper">
                함께 공부하고 싶은 사람들을 찾고, 목표를 공유하고, 스터디 활동을 관리하는 올인원
                학습 커뮤니티를 지향합니다.
            </p>
            <div className="info-layout" style={{ marginTop: 12 }}>
                <div className="info-card">
                    <h3>핵심 기능</h3>
                    <p>
                        스터디 생성·참여, 마이페이지, 관심사 관리, 멤버 현황 등 학습 활동에 필요한 기능을
                        모두 제공합니다.
                    </p>
                    <ul className="checklist">
                        <li>간편한 스터디 개설 및 초대</li>
                        <li>마이페이지에서 내 목표·관심사 관리</li>
                        <li>모바일/데스크톱 반응형 UI</li>
                    </ul>
                </div>
                <div className="info-card">
                    <h3>추천 활용법</h3>
                    <p>
                        프로젝트 기반 스터디, 면접 대비 스터디, 알고리즘 풀이 등 다양한 학습 목적에
                        맞춰 사용해 보세요.
                    </p>
                    <ul className="checklist">
                        <li>가입 → 마이페이지 설정 → 스터디 생성</li>
                        <li>관심사 기반 추천 기능 준비 중</li>
                    </ul>
                </div>
                <div className="info-card">
                    <h3>빠른 시작</h3>
                    <p>
                        아래 버튼으로 바로 새 스터디를 만들거나, 데모 스터디를 둘러보며 UI를
                        익혀보세요.
                    </p>
                    <div className="inline-actions" style={{ marginTop: 6 }}>
                        <Link className="button" to="/studies/new">
                            새 스터디 만들기
                        </Link>
                        <Link className="nav-link" to="/studies">
                            모든 스터디 보기
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;