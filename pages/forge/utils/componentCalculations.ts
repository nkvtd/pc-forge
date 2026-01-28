// Helper Functions
import {BuildSlot} from "../types/buildTypes";

export function calculateUsedRamSlots(slots: BuildSlot[]): number {
    return slots
        .filter(s => s.type === 'memory' && s.component)
        .reduce((sum, s) => {
            const modules = Number(s.component?.details?.modules || s.component?.modules || 1);
            const quantity = Number(s.component?.quantity || 1);
            return sum + (modules * quantity);
        }, 0);
}

export function getMaxRamSlots(slots: BuildSlot[]): number | null {
    const mobo = slots.find(s => s.type === 'motherboard' && s.component);
    if (!mobo?.component?.details?.numRamSlots) return null;
    return Number(mobo.component.details.numRamSlots);
}

export function calculateUsedStorageSlots(slots: BuildSlot[], formFactor: string): number {
    return slots
        .filter(s => s.type === 'storage' && s.component)
        .reduce((sum, s) => {
            const componentFormFactor = s.component?.details?.formFactor || s.component?.details?.form_factor || s.component?.formFactor;
            if (componentFormFactor?.trim().toLowerCase() === formFactor?.trim().toLowerCase()) {
                return sum + Number(s.component?.quantity || 1);
            }
            return sum;
        }, 0);
}

export function getMaxStorageSlots(slots: BuildSlot[], formFactor: string): number | null {
    const pcCase = slots.find(s => s.type === 'case' && s.component);
    if (!pcCase?.component?.details?.storageFormFactors) return null;

    const storageFormFactors = pcCase.component.details.storageFormFactors;

    if (!Array.isArray(storageFormFactors)) {
        return null;
    }

    const storageFF = storageFormFactors.find((sf: any) => {
        const sfFormFactor = sf.formFactor || sf.form_factor;
        return sfFormFactor?.trim().toLowerCase() === formFactor?.trim().toLowerCase();
    });

    if (!storageFF) {
        return null;
    }

    const numSlots = storageFF.numSlots || storageFF.num_slots;

    return Number(numSlots) || null;
}