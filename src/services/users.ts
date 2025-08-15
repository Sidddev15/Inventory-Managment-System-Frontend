import http from './http';

export type User = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'staff' | 'viewer';
    createdAt?: string;
};

export async function fetchUsers() {
    const { data } = await http.get<User[]>('/auth/users'); // if you mounted list under /api/auth/users
    return data;
}

export async function registerUser(payload: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'staff' | 'viewer';
}) {
    const { data } = await http.post<User>('/auth/register', payload);
    return data;
}

export async function updateUserRole(userId: number, role: 'admin' | 'staff' | 'viewer') {
    const { data } = await http.put<User>(`/auth/users/${userId}/role`, { role }); // OPTIONAL; add in backend if not present
    return data;
}
