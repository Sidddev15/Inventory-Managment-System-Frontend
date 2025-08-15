import http from './http';

export type CompositeItem = {
    id: number;
    name: string;
    sku: string;
    description?: string;
};

export type CompositeComponent = {
    component_item_id: number;
    quantity: number;
    // client-only fields:
    code?: string;
    name?: string;
};

export async function fetchCompositeItems(includeComponents = false) {
    const { data } = await http.get('/composite-items', {
        params: includeComponents ? { include: 'components' } : undefined,
    });
    return data;
}

export async function fetchCompositeItem(id: number) {
    const { data } = await http.get(`/composite-items/${id}`);
    return data; // { id, name, sku, description, components: [{component_item_id, quantity}] }
}

export async function createCompositeItem(payload: {
    name: string;
    sku: string;
    description?: string;
    components: CompositeComponent[];
}) {
    const { data } = await http.post('/composite-items', payload);
    return data;
}

export async function stockOutComposite(payload: {
    composite_item_id: number;
    quantity: number;
    reference_no?: string;
    note?: string;
}) {
    const { data } = await http.post('/composite-items/stock-out', payload);
    return data;
}
