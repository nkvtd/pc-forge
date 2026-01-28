export type BuildSlot = {
    id: string;
    type: string;
    label: string;
    component: any | null;
    required: boolean;
};

export const INITIAL_SLOTS: BuildSlot[] = [
    {id: 'cpu', type: 'cpu', label: 'CPU', component: null, required: true},
    {id: 'cooler', type: 'cooler', label: 'CPU Cooler', component: null, required: true},
    {id: 'motherboard', type: 'motherboard', label: 'Motherboard', component: null, required: true},
    {id: 'memory_1', type: 'memory', label: 'Memory', component: null, required: true},
    {id: 'gpu', type: 'gpu', label: 'Video Card', component: null, required: true},
    {id: 'storage_1', type: 'storage', label: 'Storage', component: null, required: true},
    {id: 'powersupply', type: 'power_supply', label: 'Power Supply', component: null, required: true},
    {id: 'case', type: 'case', label: 'Case', component: null, required: true},
];