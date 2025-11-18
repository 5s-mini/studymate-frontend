const STORAGE_KEY = 'studymate_app_state';

const delay = (value, shouldReject = false) =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldReject) {
                reject(value);
            } else {
                resolve(value);
            }
        }, 120);
    });

const ADMIN_EMAIL = 'dnclsehd123@naver.com';

const initialState = {
    users: [
        {
            id: 1,
            email: 'plain6024@naver.com',
            password: 'qwer1234',
            nickname: '오상민',
            bio: '웹 개발 프로젝트를 이끄는 리더입니다.',
            jobTitle: '풀스택 개발자',
            goals: '멋진 웹 서비스를 완성하기',
            interests: ['웹 개발', '협업', 'UI/UX'],
            joinedStudyIds: [1],
            isAdmin: true
        }
    ],
    studies: [
        {
            id: 1,
            title: '웹 개발 프로젝트 스터디',
            description: '함께 협업해서 기똥찬 웹 페이지를 개발해 봅시다.',
            owner: '오상민',
            members: ['오상민']
        }
    ]
};

const withUserDefaults = user => ({
    ...user,
    nickname: user.nickname || '스터디메이트',
    interests: Array.isArray(user.interests) ? user.interests : [],
    joinedStudyIds: Array.isArray(user.joinedStudyIds) ? user.joinedStudyIds : [],
    bio: user.bio || '',
    jobTitle: user.jobTitle || '',
    goals: user.goals || '',
    isAdmin: Boolean(user.isAdmin) || user.email === ADMIN_EMAIL
});

const withStudyDefaults = study => ({
    ...study,
    members: Array.isArray(study.members) ? study.members : []
});

const loadState = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            const defaultState = {
                users: initialState.users.map(withUserDefaults),
                studies: initialState.studies.map(withStudyDefaults)
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
            return { ...defaultState };
        }

        const parsed = JSON.parse(stored);
        return {
            users: (Array.isArray(parsed.users) ? parsed.users : [...initialState.users]).map(
                withUserDefaults
            ),
            studies: (Array.isArray(parsed.studies) ? parsed.studies : [...initialState.studies]).map(
                withStudyDefaults
            )
        };
    } catch (error) {
        const defaultState = {
            users: initialState.users.map(withUserDefaults),
            studies: initialState.studies.map(withStudyDefaults)
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
        return { ...defaultState };
    }
};

const saveState = state => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const nextId = list => (list.length ? Math.max(...list.map(item => item.id)) + 1 : 1);

const getCurrentUser = state => {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }

    const userId = Number(token.replace('token-', ''));
    return state.users.find(user => user.id === userId) || null;
};

const success = data => delay({ data });
const failure = (message, status = 400) =>
    delay(
        {
            response: {
                status,
                data: { message }
            }
        },
        true
    );

const api = {
    async get(path) {
        const state = loadState();

        if (path === '/studies') {
            const studies = state.studies.map(study => ({ ...study }));
            return success(studies);
        }

        if (path.startsWith('/studies/')) {
            const id = Number(path.replace('/studies/', ''));
            const study = state.studies.find(item => item.id === id);
            if (!study) {
                return failure('스터디를 찾을 수 없습니다.', 404);
            }
            return success({ ...study });
        }

        if (path === '/users/me') {
            const user = getCurrentUser(state);
            if (!user) {
                return failure('인증 정보가 없습니다.', 401);
            }
            const { password, ...safeUser } = user;
            const ownedStudies = state.studies.filter(study => study.owner === safeUser.nickname);
            const joinedStudies = state.studies.filter(study =>
                safeUser.joinedStudyIds.includes(study.id)
            );

            return success({
                ...safeUser,
                ownedStudies,
                joinedStudies,
                stats: {
                    ownedCount: ownedStudies.length,
                    joinedCount: joinedStudies.length,
                    interestCount: safeUser.interests.length
                }
            });
        }

        return failure('지원하지 않는 경로입니다.', 404);
    },

    async post(path, body = {}) {
        const state = loadState();

        if (path === '/users/signup') {
            const exists = state.users.some(user => user.email === body.email);
            if (exists) {
                return failure('이미 가입된 이메일입니다.', 409);
            }

            const newUser = withUserDefaults({
                id: nextId(state.users),
                email: body.email,
                password: body.password,
                nickname: body.nickname || '새 사용자',
                bio: body.bio || '',
                jobTitle: body.jobTitle || '',
                goals: body.goals || '',
                interests: body.interests || []
            });

            state.users.push(newUser);
            saveState(state);

            const { password, ...safeUser } = newUser;
            return success(safeUser);
        }

        if (path === '/users/login') {
            const user = state.users.find(
                item => item.email === body.email && item.password === body.password
            );

            if (!user) {
                return failure('이메일 또는 비밀번호가 올바르지 않습니다.', 401);
            }

            const token = `token-${user.id}`;
            localStorage.setItem('token', token);
            const { password, ...safeUser } = user;
            return success({ token, user: safeUser });
        }

        if (path === '/users/reset-password') {
            const { email, nickname, newPassword } = body;
            const userIndex = state.users.findIndex(
                item => item.email === email && item.nickname === nickname
            );

            if (userIndex === -1) {
                return failure('입력한 정보와 일치하는 사용자가 없습니다.', 404);
            }

            if (!newPassword || String(newPassword).length < 4) {
                return failure('비밀번호는 4자 이상이어야 합니다.', 400);
            }

            const updatedUser = {
                ...state.users[userIndex],
                password: newPassword
            };

            state.users[userIndex] = updatedUser;
            saveState(state);

            const token = `token-${updatedUser.id}`;
            localStorage.setItem('token', token);
            const { password, ...safeUser } = updatedUser;
            return success({ token, user: safeUser, message: '비밀번호가 재설정되었습니다.' });
        }

        if (path === '/studies') {
            const currentUser = getCurrentUser(state);
            if (!currentUser) {
                return failure('로그인이 필요합니다.', 401);
            }

            const owner = currentUser.nickname;

            const newStudy = withStudyDefaults({
                id: nextId(state.studies),
                title: body.title || '제목 없음',
                description: body.description || '',
                owner,
                members: [currentUser.nickname]
            });

            state.studies.push(newStudy);

            const index = state.users.findIndex(user => user.id === currentUser.id);
            if (index !== -1) {
                const joined = new Set(state.users[index].joinedStudyIds);
                joined.add(newStudy.id);
                state.users[index] = {
                    ...state.users[index],
                    joinedStudyIds: Array.from(joined)
                };
            }

            saveState(state);
            return success({ ...newStudy });
        }

        if (path.startsWith('/studies/') && path.endsWith('/join')) {
            const currentUser = getCurrentUser(state);
            if (!currentUser) {
                return failure('로그인이 필요합니다.', 401);
            }

            const id = Number(path.replace('/studies/', '').replace('/join', ''));
            const studyIndex = state.studies.findIndex(item => item.id === id);
            if (studyIndex === -1) {
                return failure('스터디를 찾을 수 없습니다.', 404);
            }

            const study = state.studies[studyIndex];
            const userIndex = state.users.findIndex(user => user.id === currentUser.id);

            const members = new Set(study.members || []);
            members.add(currentUser.nickname);
            const joinedIds = new Set(state.users[userIndex].joinedStudyIds || []);
            joinedIds.add(id);

            state.studies[studyIndex] = {
                ...study,
                members: Array.from(members)
            };
            state.users[userIndex] = {
                ...state.users[userIndex],
                joinedStudyIds: Array.from(joinedIds)
            };

            saveState(state);
            return success({ ...state.studies[studyIndex] });
        }

        return failure('지원하지 않는 경로입니다.', 404);
    },

    async put(path, body = {}) {
        const state = loadState();

        if (path.startsWith('/studies/')) {
            const id = Number(path.replace('/studies/', ''));
            const index = state.studies.findIndex(item => item.id === id);
            if (index === -1) {
                return failure('스터디를 찾을 수 없습니다.', 404);
            }

            const current = state.studies[index];
            const updated = {
                ...current,
                title: body.title ?? current.title,
                description: body.description ?? current.description
            };

            state.studies[index] = updated;
            saveState(state);

            return success({ ...updated });
        }

        if (path === '/users/me') {
            const currentUser = getCurrentUser(state);
            if (!currentUser) {
                return failure('로그인이 필요합니다.', 401);
            }

            const index = state.users.findIndex(user => user.id === currentUser.id);
            if (index === -1) {
                return failure('사용자를 찾을 수 없습니다.', 404);
            }

            const current = state.users[index];
            const updated = withUserDefaults({
                ...current,
                bio: body.bio ?? current.bio,
                jobTitle: body.jobTitle ?? current.jobTitle,
                goals: body.goals ?? current.goals,
                interests: Array.isArray(body.interests)
                    ? body.interests
                    : current.interests
            });

            state.users[index] = updated;
            saveState(state);

            const { password, ...safeUser } = updated;
            return success(safeUser);
        }

        return failure('지원하지 않는 경로입니다.', 404);
    },

    async delete(path) {
        const state = loadState();

        if (path.startsWith('/studies/')) {
            const currentUser = getCurrentUser(state);
            if (!currentUser) {
                return failure('로그인이 필요합니다.', 401);
            }

            const id = Number(path.replace('/studies/', ''));
            const index = state.studies.findIndex(item => item.id === id);
            if (index === -1) {
                return failure('스터디를 찾을 수 없습니다.', 404);
            }

            const study = state.studies[index];
            if (study.owner !== currentUser.nickname && !currentUser.isAdmin) {
                return failure('삭제 권한이 없습니다.', 403);
            }

            state.studies.splice(index, 1);

            state.users = state.users.map(user => ({
                ...user,
                joinedStudyIds: (user.joinedStudyIds || []).filter(joinedId => joinedId !== id)
            }));

            saveState(state);
            return success({ message: '스터디가 삭제되었습니다.' });
        }

        return failure('지원하지 않는 경로입니다.', 404);
    }
};

export default api;