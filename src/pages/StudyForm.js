import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate, useParams } from "react-router-dom";

function StudyForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: "", description: "" });
    const isEdit = !!id;

    useEffect(() => {
        if (isEdit) {
            api.get(`/studies/${id}`).then((res) => setForm(res.data));
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await api.put(`/studies/${id}`, form);
                alert("스터디 수정 완료");
            } else {
                await api.post("/studies", form);
                alert("스터디 생성 완료");
            }
            navigate("/");
        } catch (err) {
            alert("저장 실패");
        }
    };

    return (
        <div>
            <h2>{isEdit ? "스터디 수정" : "새 스터디 생성"}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="스터디 제목"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
                <br />
                <textarea
                    name="description"
                    placeholder="스터디 설명"
                    value={form.description}
                    onChange={handleChange}
                    required
                />
                <br />
                <button type="submit">{isEdit ? "수정" : "등록"}</button>
            </form>
        </div>
    );
}

export default StudyForm;