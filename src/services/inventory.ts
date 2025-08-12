// src/services/inventory.ts
import http from './http';

export type InventorySummaryItem = {
    id: number;
    name: string;
    code: string;
    quantity: number;
    threshold: number;
    group_id?: number;
};

export async function fetchInventorySummary() {
    const { data } = await http.get<InventorySummaryItem[]>('/inventory/summary');
    return data;
}

export async function fetchLowStock(threshold?: number) {
    const params = threshold ? { threshold } : undefined;
    const { data } = await http.get('/inventory/low-stock', { params });
    // backend returns { success, message, data } — normalize:
    if (data?.data) return data.data;
    return data;
}
