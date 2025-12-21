import { relations } from "drizzle-orm";

import {
    componentsTable,
    CPUTable,
    GPUTable,
    memoryTable,
    powerSupplyTable,
    pcCasesTable,
    caseStorageFormFactorsTable,
    casePsFormFactorsTable,
    caseMoboFormFactorsTable,
    coolersTable,
    coolerCPUSocketsTable,
    motherboardsTable,
    storageTable,
    memoryCardsTable,
    opticalDrivesTable,
    soundCardsTable,
    cablesTable,
    networkAdaptersTable,
    networkCardsTable,

} from "./components";

import {
    buildsTable,
    buildComponentsTable,
    favoriteBuildsTable,
    ratingBuildsTable,
    reviewsTable
} from "./builds"

import {
    usersTable,
    adminsTable,
    suggestionsTable
} from "./users";

export const usersRelations = relations(usersTable, ({ many, one }) => ({
    builds: many(buildsTable),
    reviews: many(reviewsTable),
    favorites: many(favoriteBuildsTable),
    ratings: many(ratingBuildsTable),
    suggestions: many(suggestionsTable),
    adminProfile: one(adminsTable, {
        fields: [usersTable.id],
        references: [adminsTable.userId],
    })
}));

export const adminsRelations = relations(adminsTable, ({ one, many }) => ({
    user: one(usersTable, {
        fields: [adminsTable.userId],
        references: [usersTable.id],
    }),
    moderatedSuggestions: many(suggestionsTable),
}));

export const suggestionsRelations = relations(suggestionsTable, ({ one }) => ({
    author: one(usersTable, {
        fields: [suggestionsTable.userId],
        references: [usersTable.id],
    }),
    moderator: one(adminsTable, {
        fields: [suggestionsTable.adminId],
        references: [adminsTable.userId],
    }),
}));

export const buildRelations = relations(buildsTable, ({ one, many }) => ({
    owner: one(usersTable, {
        fields: [buildsTable.userId],
        references: [usersTable.id],
    }),
    buildComponents: many(buildComponentsTable),
    favorites: many(favoriteBuildsTable),
    ratings: many(ratingBuildsTable),
    reviews: many(reviewsTable),
}));

export const buildComponentRelations = relations(buildComponentsTable, ({ one }) => ({
    build: one(buildsTable, {
        fields: [buildComponentsTable.buildId],
        references: [buildsTable.id],
    }),
    component: one(componentsTable, {
        fields: [buildComponentsTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const favoriteBuildRelations = relations(favoriteBuildsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [favoriteBuildsTable.userId],
        references: [usersTable.id],
    }),
    build: one(buildsTable, {
        fields: [favoriteBuildsTable.buildId],
        references: [buildsTable.id],
    }),
}));

export const ratingBuildRelations = relations(ratingBuildsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [ratingBuildsTable.userId],
        references: [usersTable.id],
    }),
    build: one(buildsTable, {
        fields: [ratingBuildsTable.buildId],
        references: [buildsTable.id],
    }),
}));

export const reviewRelations = relations(reviewsTable, ({ one }) => ({
    author: one(usersTable, {
        fields: [reviewsTable.userId],
        references: [usersTable.id],
    }),
    build: one(buildsTable, {
        fields: [reviewsTable.buildId],
        references: [buildsTable.id],
    }),
}));

export const componentsRelations = relations(componentsTable, ({ many, one }) => ({
    buildComponents: many(buildComponentsTable),

    cpu: one(CPUTable, {
        fields: [componentsTable.id],
        references: [CPUTable.componentId]
    }),
    gpu: one(GPUTable, {
        fields: [componentsTable.id],
        references: [GPUTable.componentId]
    }),
    memory: one(memoryTable, {
        fields: [componentsTable.id],
        references: [memoryTable.componentId]
    }),
    powerSupply: one(powerSupplyTable, {
        fields: [componentsTable.id],
        references: [powerSupplyTable.componentId]
    }),
    pcCase: one(pcCasesTable, {
        fields: [componentsTable.id],
        references: [pcCasesTable.componentId]
    }),
    cooler: one(coolersTable, {
        fields: [componentsTable.id],
        references: [coolersTable.componentId]
    }),
    motherboard: one(motherboardsTable, {
        fields: [componentsTable.id],
        references: [motherboardsTable.componentId]
    }),
    storage: one(storageTable, {
        fields: [componentsTable.id],
        references: [storageTable.componentId]
    }),
    memoryCard: one(memoryCardsTable, {
        fields: [componentsTable.id],
        references: [memoryCardsTable.componentId]
    }),
    opticalDrive: one(opticalDrivesTable, {
        fields: [componentsTable.id],
        references: [opticalDrivesTable.componentId]
    }),
    soundCard: one(soundCardsTable, {
        fields: [componentsTable.id],
        references: [soundCardsTable.componentId]
    }),
    cables: one(cablesTable, {
        fields: [componentsTable.id],
        references: [cablesTable.componentId]
    }),
    networkAdapter: one(networkAdaptersTable, {
        fields: [componentsTable.id],
        references: [networkAdaptersTable.componentId]
    }),
    networkCard: one(networkCardsTable, {
        fields: [componentsTable.id],
        references: [networkCardsTable.componentId]
    }),
}));

export const cpuRelations = relations(CPUTable, ({ one }) => ({
    component: one(componentsTable, {
        fields: [CPUTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const gpuRelations = relations(GPUTable, ({ one }) => ({
    component: one(componentsTable, {
        fields: [GPUTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const memoryRelations = relations(memoryTable, ({ one }) => ({
    component: one(componentsTable, {
        fields: [memoryTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const powerSupplyRelations = relations(powerSupplyTable, ({ one }) => ({
    component: one(componentsTable, {
        fields: [powerSupplyTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const motherboardRelations = relations(motherboardsTable, ({ one }) => ({
    component: one(componentsTable, {
        fields: [motherboardsTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const storageRelations = relations(storageTable, ({ one }) => ({
    component: one(componentsTable, {
        fields: [storageTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const memoryCardRelations = relations(memoryCardsTable, ({ one }) => ({
    component: one(componentsTable, {
        fields: [memoryCardsTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const opticalDriveRelations = relations(opticalDrivesTable, ({ one }) => ({
    component: one(componentsTable, {
        fields: [opticalDrivesTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const cablesRelations = relations(cablesTable, ({ one }) => ({
    component: one(componentsTable, {
        fields: [cablesTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const networkAdapterRelations = relations(networkAdaptersTable, ({ one }) => ({
    component: one(componentsTable, {
        fields: [networkAdaptersTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const networkCardRelations = relations(networkCardsTable, ({ one }) => ({
    component: one(componentsTable, {
        fields: [networkCardsTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const pcCaseRelations = relations(pcCasesTable, ({ one, many }) => ({
    component: one(componentsTable, {
        fields: [pcCasesTable.componentId],
        references: [componentsTable.id],
    }),
    storageFormFactors: many(caseStorageFormFactorsTable),
    psFormFactors: many(casePsFormFactorsTable),
    moboFormFactors: many(caseMoboFormFactorsTable),
}));

export const caseStorageFormFactorsRelations = relations(caseStorageFormFactorsTable, ({ one }) => ({
    pcCase: one(pcCasesTable, {
        fields: [caseStorageFormFactorsTable.caseId],
        references: [pcCasesTable.componentId],
    }),
}));

export const casePsFormFactorsRelations = relations(casePsFormFactorsTable, ({ one }) => ({
    pcCase: one(pcCasesTable, {
        fields: [casePsFormFactorsTable.caseId],
        references: [pcCasesTable.componentId],
    }),
}));

export const caseMoboFormFactorsRelations = relations(caseMoboFormFactorsTable, ({ one }) => ({
    pcCase: one(pcCasesTable, {
        fields: [caseMoboFormFactorsTable.caseId],
        references: [pcCasesTable.componentId],
    }),
}));

export const coolerRelations = relations(coolersTable, ({ one, many }) => ({
    component: one(componentsTable, {
        fields: [coolersTable.componentId],
        references: [componentsTable.id],
    }),
    cpuSockets: many(coolerCPUSocketsTable),
}));

export const coolerCpuSocketsRelations = relations(coolerCPUSocketsTable, ({ one }) => ({
    cooler: one(coolersTable, {
        fields: [coolerCPUSocketsTable.coolerId],
        references: [coolersTable.componentId],
    }),
}));

export const soundCardRelations = relations(soundCardsTable, ({ one, many }) => ({
    component: one(componentsTable, {
        fields: [soundCardsTable.componentId],
        references: [componentsTable.id],
    }),
}));