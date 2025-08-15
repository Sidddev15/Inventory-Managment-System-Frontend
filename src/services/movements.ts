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
    const { data } = await http.get('/inventory-movements');
    return (Array.isArray(data) ? data : []).slice(0, limit);
}

export async function fetchMovementsByRange(fromISO: string, toISO: string) {
    const { data } = await http.get<Movement[]>('/inventory-movements/filter', { params: { from: fromISO, to: toISO, limit: 500 } });
    return data;
}

export async function stockIn(payload: {
    item_id: number;
    quantity: number;
    reason?: string;
    reference_no?: string;
    note?: string;
}) {
    const { data } = await http.post('/inventory-movements/in', payload);
    return data;
}

export async function stockOut(payload: {
    item_id: number;
    quantity: number;
    reason?: string;
    reference_no?: string;
    note?: string;
}) {
    const { data } = await http.post('/inventory-movements/out', payload);
    return data;
}

export async function adjustStock(payload: {
    item_id: number;
    quantity: number; // for ADJUSTMENT this is the NEW quantity
    reason?: string;
    reference_no?: string;
    note?: string;
}) {
    const { data } = await http.post('/inventory-movements/adjust', payload);
    return data;
}

export async function fetchMovementsByDate(date: string) {
    // date: YYYY-MM-DD
    const from = `${date}T00:00:00.000Z`;
    const to = `${date}T23:59:59.999Z`;
    const { data } = await http.get('/inventory-movements/filter', { params: { from, to } });
    return data;
}
