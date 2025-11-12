import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

function StudyList() {
    const [studies, setStudies] = useState([]);

    useEffect(() => {
        const fetchStudies = async () => {
            try {
                const res = await api.get("/studies");
                setStudies(res.data);
            } catch (err) {
                alert("스터디 목록 불러오기 실패");
            }
        };
        fetchStudies();
    }, []);

    return (
        <div>
            <h2>스터디 목록</h2>
            <Link to="/studies/new">새 스터디 만들기</Link>
            <ul>
                {studies.map((study) => (
                    <li key={study.id}>
                        <Link to={`/studies/${study.id}`}>{study.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default StudyList;