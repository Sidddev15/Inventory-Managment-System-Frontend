import http from './http';

export type PriceList = {
    id: number;
    name: string;
    valid_from?: string;
    valid_to?: string;
    description?: string;
};

export type PriceListItem = {
    id: number;
    price_list_id: number;
    item_id: number;
    item_type: 'inventory' | 'composite';
    price: number;
    currency: string;
    // denormalized labels for UI (optional if backend returns names)
    code?: string;
    name?: string;
};

export async function fetchPriceLists() {
    const { data } = await http.get<PriceList[]>('/price-lists');
    return data;
}

export async function createPriceList(payload: {
    name: string;
    valid_from?: string; // ISO
    valid_to?: string;   // ISO
    description?: string;
}) {
    const { data } = await http.post('/price-lists', payload);
    return data as PriceList;
}

export async function fetchPriceListDetail(id: number) {
    // We wired GET /price-lists/:id to include items
    const { data } = await http.get<{ id: number } & PriceList & { items: PriceListItem[] }>(`/price-lists/${id}`);
    return data;
}

export async function addPriceListItem(payload: {
    price_list_id: number;
    item_id: number;
    item_type: 'inventory' | 'composite';
    price: number;
    currency?: string;
}) {
    const { data } = await http.post('/price-lists/item', payload);
    return data as PriceListItem;
}

// If you add update/delete endpoints later, wire here:
export async function deletePriceListItem(id: number) {
    await http.delete(`/price-lists/items/${id}`); // OPTIONAL: add to backend if you want deletes
}

export async function updatePriceListItem(id: number, payload: { price?: number; currency?: string }) {
    const { data } = await http.put(`/price-lists/items/${id}`, payload); // OPTIONAL: add to backend if you want inline update
    return data as PriceListItem;
}
