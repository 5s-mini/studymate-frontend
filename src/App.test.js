import { render, screen } from '@testing-library/react';
import App from './App';
import api from './api/api';

jest.mock('./api/api', () => ({
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} }))
}));

test('홈 경로에서 스터디 목록 제목을 렌더링한다', async () => {
    render(<App />);
    const heading = await screen.findByText('스터디 목록');
    expect(heading).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith('/studies');
});