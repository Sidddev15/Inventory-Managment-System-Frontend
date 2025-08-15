import http from './http';

export type Role = 'admin' | 'staff' | 'viewer';
export type Status = 'active' | 'inactive';

export type User = {
    id: number;
    name: string;
    email: string;
    role: Role;
    status?: Status;
    createdAt?: string;
};

export async function fetchUsers() {
    const { data } = await http.get<User[]>('/auth/users'); // admin-only
    return data;
}

export async function registerUser(payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
    status?: Status;
}) {
    const { data } = await http.post<User>('/auth/register', payload);
    return data;
}

export async function updateUserRole(userId: number, role: Role) {
    const { data } = await http.put<User>(`/auth/users/${userId}/role`, { role });
    return data;
}

export async function updateUser(
    userId: number,
    payload: Partial<{
        name: string;
        email: string;
        role: Role;
        status: Status;
        password: string; // optional reset
    }>
) {
    const { data } = await http.put<User>(`/auth/users/${userId}`, payload);
    return data;
}

export async function createUser(payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
    status?: 'active' | 'inactive';
}) {
    const { data } = await http.post<User>('/auth/users', payload); // POST /api/auth/users
    return data;
}
