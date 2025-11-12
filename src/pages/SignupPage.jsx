import { useState } from "react";
import api from "../api/axios";

export default function SignupPage() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        nickname: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/users/signup", form);
            setMessage("회원가입 성공: " + res.status);
        } catch (err) {
            console.error(err);
            setMessage("회원가입 실패");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-md w-96 space-y-4"
            >
                <h2 className="text-2xl font-semibold text-center mb-4">회원가입</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="이메일"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                <input
                    type="text"
                    name="nickname"
                    placeholder="닉네임"
                    value={form.nickname}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    회원가입
                </button>

                {message && (
                    <p className="text-center text-sm text-gray-600 mt-2">{message}</p>
                )}
            </form>
        </div>
    );
}