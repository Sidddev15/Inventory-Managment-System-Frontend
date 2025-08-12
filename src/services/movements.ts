// src/services/movements.ts
import http from './http';

export type Movement = {
    id: number;
    item_id: number;
    type: 'IN' | 'OUT' | 'ADJUSTMENT';
    quantity: number;
    before_quantity?: number;
    after_quantity?: number;
    reason?: string;
    reference_no?: string;
    createdAt: string;
};

export async function fetchRecentMovements(limit = 10) {
    // const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    // const { data } = await http.get<Movement[]>('/inventory-movements/filter', { params: { from } });
    // return (data || []).slice(0, limit);
    const { data } = await http.get('/inventory-movements');
    return (Array.isArray(data) ? data : []).slice(0, limit);
}

export async function fetchMovementsByDate(dateISO: string) {
    // dateISO expected as 'YYYY-MM-DD'
    const { data } = await http.get<Movement[]>('/inventory-movements/filter', { params: { date: dateISO, limit: 200 } });
    return data;
}

export async function fetchMovementsByRange(fromISO: string, toISO: string) {
    const { data } = await http.get<Movement[]>('/inventory-movements/filter', { params: { from: fromISO, to: toISO, limit: 500 } });
    return data;
}
