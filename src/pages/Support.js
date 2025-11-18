import React from 'react';
import { Link } from '../router/SimpleRouter';

function Support() {
    return (
        <section className="form-card" style={{ maxWidth: '980px' }}>
            <p className="eyebrow">지원 센터</p>
            <h2>도움이 필요하신가요?</h2>
            <p className="helper">
                스터디 생성, 로그인, 마이페이지 설정 등 자주 묻는 질문과 지원 채널을 안내합니다. 문제가
                해결되지 않는다면 아래 연락처로 문의해 주세요.
            </p>
            <div className="info-layout" style={{ marginTop: 12 }}>
                <div className="info-card">
                    <h3>자주 묻는 질문</h3>
                    <ul className="checklist">
                        <li>비밀번호 분실 시 재설정 페이지에서 이메일·닉네임 입력</li>
                        <li>새 스터디 생성 후 목록이 비어 보이면 새로고침으로 최신화</li>
                    </ul>
                </div>
                <div className="info-card">
                    <h3>문제 해결 팁</h3>
                    <ul className="checklist">
                        <li>입력 필드는 모두 필수이며, 8자 이상의 비밀번호를 권장</li>
                        <li>모바일에서는 주소창을 닫아 전체 레이아웃을 확인</li>
                        <li>버그를 발견하면 아래 연락처로 알려주세요!</li>
                    </ul>
                </div>
                <div className="info-card">
                    <h3>문의 채널</h3>
                    <p>
                        <strong>dnclsehd123@naver.com</strong>로 언제든 도움을 요청하세요.
                    </p>
                    <div className="inline-actions" style={{ marginTop: 6 }}>
                        <Link className="button" to="/studies/new">
                            새 스터디 만들기
                        </Link>
                        <Link className="nav-link" to="/reset-password">
                            비밀번호 재설정
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Support;