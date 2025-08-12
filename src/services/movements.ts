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
