// src/services/users.ts
import http from './http';

export type Role = 'admin' | 'staff' | 'viewer';

export type User = {
    id: number;
    name: string;
    email: string;
    role: Role;
    status?: 'active' | 'inactive';
    createdAt?: string;
};

export async function fetchUsers() {
    const { data } = await http.get<User[]>('/auth/users'); // GET /api/auth/users
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

export async function updateUserRole(userId: number, role: Role) {
    const { data } = await http.put<User>(`/auth/users/${userId}/role`, { role });
    return data;
}
