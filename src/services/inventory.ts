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

export type InventoryItem = {
    id: number;
    name: string;
    code: string;
    size?: string;
    description?: string;
    group_id?: number;
    quantity: number;
    threshold?: number;
    createdAt?: string;
}

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

export async function fetchInventory(params?: { group_id?: number; q?: string }) {
    const { data } = await http.get<InventoryItem[]>('/inventory', { params });
    return data;
}

export async function deleteInventoryItem(id: number) {
    await http.delete(`/inventory/${id}`);
}

export type ItemGroup = { id: number; name: string; description?: string };

export async function fetchItemGroups() {
    const { data } = await http.get<ItemGroup[]>('/item-groups');
    return data;
}
