import { relations } from "drizzle-orm";

import {
    componentsTable,
    CPUTable,
    GPUTable,
    memoryTable,
    powerSupplyTable,
    pcCaseTable,
    caseStorageFormFactorsTable,
    casePsFormFactorsTable,
    caseMoboFormFactorsTable,
    coolerTable,
    coolerCPUSocketsTable,
    motherboardTable,
    storageTable,
    memoryCardTable,
    opticalDriveTable,
    soundCardTable,
    soundCardChannelsTable,
    cablesTable,
    networkAdapterTable,
    networkCardTable,

} from "./components";

import {
    buildTable,
    buildComponentTable,
    favoriteBuildTable,
    ratingBuildTable,
    reviewTable
} from "./builds"

import {
    usersTable,
    adminsTable,
    suggestionsTable
} from "./users";

export const usersRelations = relations(usersTable, ({ many, one }) => ({
    builds: many(buildTable),
    reviews: many(reviewTable),
    favorites: many(favoriteBuildTable),
    ratings: many(ratingBuildTable),
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

export const buildRelations = relations(buildTable, ({ one, many }) => ({
    owner: one(usersTable, {
        fields: [buildTable.userId],
        references: [usersTable.id],
    }),
    buildComponents: many(buildComponentTable),
    favorites: many(favoriteBuildTable),
    ratings: many(ratingBuildTable),
    reviews: many(reviewTable),
}));

export const buildComponentRelations = relations(buildComponentTable, ({ one }) => ({
    build: one(buildTable, {
        fields: [buildComponentTable.buildId],
        references: [buildTable.id],
    }),
    component: one(componentsTable, {
        fields: [buildComponentTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const favoriteBuildRelations = relations(favoriteBuildTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [favoriteBuildTable.userId],
        references: [usersTable.id],
    }),
    build: one(buildTable, {
        fields: [favoriteBuildTable.buildId],
        references: [buildTable.id],
    }),
}));

export const ratingBuildRelations = relations(ratingBuildTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [ratingBuildTable.userId],
        references: [usersTable.id],
    }),
    build: one(buildTable, {
        fields: [ratingBuildTable.buildId],
        references: [buildTable.id],
    }),
}));

export const reviewRelations = relations(reviewTable, ({ one }) => ({
    author: one(usersTable, {
        fields: [reviewTable.userId],
        references: [usersTable.id],
    }),
    build: one(buildTable, {
        fields: [reviewTable.buildId],
        references: [buildTable.id],
    }),
}));

export const componentsRelations = relations(componentsTable, ({ many, one }) => ({
    buildComponents: many(buildComponentTable),

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
    pcCase: one(pcCaseTable, {
        fields: [componentsTable.id],
        references: [pcCaseTable.componentId]
    }),
    cooler: one(coolerTable, {
        fields: [componentsTable.id],
        references: [coolerTable.componentId]
    }),
    motherboard: one(motherboardTable, {
        fields: [componentsTable.id],
        references: [motherboardTable.componentId]
    }),
    storage: one(storageTable, {
        fields: [componentsTable.id],
        references: [storageTable.componentId]
    }),
    memoryCard: one(memoryCardTable, {
        fields: [componentsTable.id],
        references: [memoryCardTable.componentId]
    }),
    opticalDrive: one(opticalDriveTable, {
        fields: [componentsTable.id],
        references: [opticalDriveTable.componentId]
    }),
    soundCard: one(soundCardTable, {
        fields: [componentsTable.id],
        references: [soundCardTable.componentId]
    }),
    cables: one(cablesTable, {
        fields: [componentsTable.id],
        references: [cablesTable.componentId]
    }),
    networkAdapter: one(networkAdapterTable, {
        fields: [componentsTable.id],
        references: [networkAdapterTable.componentId]
    }),
    networkCard: one(networkCardTable, {
        fields: [componentsTable.id],
        references: [networkCardTable.componentId]
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

export const motherboardRelations = relations(motherboardTable, ({ one }) => ({
    component: one(componentsTable, {
        fields: [motherboardTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const storageRelations = relations(storageTable, ({ one }) => ({
    component: one(componentsTable, {
        fields: [storageTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const memoryCardRelations = relations(memoryCardTable, ({ one }) => ({
    component: one(componentsTable, {
        fields: [memoryCardTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const opticalDriveRelations = relations(opticalDriveTable, ({ one }) => ({
    component: one(componentsTable, {
        fields: [opticalDriveTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const cablesRelations = relations(cablesTable, ({ one }) => ({
    component: one(componentsTable, {
        fields: [cablesTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const networkAdapterRelations = relations(networkAdapterTable, ({ one }) => ({
    component: one(componentsTable, {
        fields: [networkAdapterTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const networkCardRelations = relations(networkCardTable, ({ one }) => ({
    component: one(componentsTable, {
        fields: [networkCardTable.componentId],
        references: [componentsTable.id],
    }),
}));

export const pcCaseRelations = relations(pcCaseTable, ({ one, many }) => ({
    component: one(componentsTable, {
        fields: [pcCaseTable.componentId],
        references: [componentsTable.id],
    }),
    storageFormFactors: many(caseStorageFormFactorsTable),
    psFormFactors: many(casePsFormFactorsTable),
    moboFormFactors: many(caseMoboFormFactorsTable),
}));

export const caseStorageFormFactorsRelations = relations(caseStorageFormFactorsTable, ({ one }) => ({
    pcCase: one(pcCaseTable, {
        fields: [caseStorageFormFactorsTable.caseId],
        references: [pcCaseTable.componentId],
    }),
}));

export const casePsFormFactorsRelations = relations(casePsFormFactorsTable, ({ one }) => ({
    pcCase: one(pcCaseTable, {
        fields: [casePsFormFactorsTable.caseId],
        references: [pcCaseTable.componentId],
    }),
}));

export const caseMoboFormFactorsRelations = relations(caseMoboFormFactorsTable, ({ one }) => ({
    pcCase: one(pcCaseTable, {
        fields: [caseMoboFormFactorsTable.caseId],
        references: [pcCaseTable.componentId],
    }),
}));

export const coolerRelations = relations(coolerTable, ({ one, many }) => ({
    component: one(componentsTable, {
        fields: [coolerTable.componentId],
        references: [componentsTable.id],
    }),
    cpuSockets: many(coolerCPUSocketsTable),
}));

export const coolerCpuSocketsRelations = relations(coolerCPUSocketsTable, ({ one }) => ({
    cooler: one(coolerTable, {
        fields: [coolerCPUSocketsTable.cooler_id],
        references: [coolerTable.componentId],
    }),
}));

export const soundCardRelations = relations(soundCardTable, ({ one, many }) => ({
    component: one(componentsTable, {
        fields: [soundCardTable.componentId],
        references: [componentsTable.id],
    }),
    channels: many(soundCardChannelsTable),
}));

export const soundCardChannelsRelations = relations(soundCardChannelsTable, ({ one }) => ({
    soundCard: one(soundCardTable, {
        fields: [soundCardChannelsTable.soundCardId],
        references: [soundCardTable.componentId],
    }),
}));