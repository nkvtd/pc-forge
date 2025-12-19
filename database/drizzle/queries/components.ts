import type { Database } from "../db";
import { componentsTable, suggestionsTable } from "../schema";

export async function getComponentSuggestions(db: Database) {

}

export async function setComponentSuggestionStatus(db: Database, suggestionId: number, status: string, adminComment: string) {

}

export async function getAllComponents(db: Database, componentType?: string, q?: string, page?: number, pageSize?: number) {

}