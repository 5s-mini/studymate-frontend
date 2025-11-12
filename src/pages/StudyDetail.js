import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

function StudyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [study, setStudy] = useState(null);

    useEffect(() => {
        const fetchStudy = async () => {
            try {
                const res = await api.get(`/studies/${id}`);
                setStudy(res.data);
            } catch {
                alert("스터디 정보를 불러올 수 없습니다.");
            }
        };
        fetchStudy();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                await api.delete(`/studies/${id}`);
                alert("삭제 완료");
                navigate("/");
            } catch {
                alert("삭제 실패");
            }
        }
    };

    if (!study) return <div>로딩 중...</div>;

    return (
        <div>
            <h2>{study.title}</h2>
            <p>{study.description}</p>
            <button onClick={() => navigate(`/studies/edit/${id}`)}>수정</button>
            <button onClick={handleDelete}>삭제</button>
        </div>
    );
}

export default StudyDetail;