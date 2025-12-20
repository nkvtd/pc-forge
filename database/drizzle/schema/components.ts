import {pgTable, serial, integer, text, numeric, boolean, date, primaryKey, check} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";

export const componentsTable = pgTable("components", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    brand: text("brand").notNull(),
    price: numeric("price").notNull(),
    imgUrl: text("img_url"),
    type: text("type").notNull()
    },
    (t) => ({
        checkType: check("check_type", sql`${t.type} in 
      ('cpu', 'gpu', 'memory', 'storage', 'power_supply', 'motherboard', 'case', 'cooler', 'memory_card', 'optical_drive', 'sound_card', 'cables', 'network_adapter', 'network_card')`)
    }),
);

// Base Components
export const CPUTable = pgTable("cpu", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    socket: text("socket").notNull(),
    cores: integer("cores").notNull(),
    threads: integer("threads").notNull(),
    baseClock: numeric("base_clock").notNull(),
    boostClock: numeric("boost_clock"),
    tdp: numeric("tdp").notNull(),
});

export const GPUTable = pgTable("gpu", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    vram: numeric("vram").notNull(),
    tdp: numeric("tdp").notNull(),
    baseClock: numeric("base_clock"),
    boostClock: numeric("boost_clock"),
    chipset: text("chipset").notNull(),
    length: numeric("length").notNull(),
});

export const memoryTable = pgTable("memory", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    type: text("type").notNull(),
    speed: numeric("speed").notNull(),
    capacity: numeric("capacity").notNull(),
    modules: integer("modules").notNull(),
});

export const powerSupplyTable = pgTable("power_supply", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    type: text("type").notNull(),
    wattage: numeric("wattage").notNull(),
    formFactor: text("form_factor").notNull(),
});

export const pcCasesTable = pgTable("pc_case", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    coolerMaxHeight: numeric("cooler_max_height").notNull(),
    gpuMaxLength: numeric("gpu_max_length").notNull(),
});

// Case multi-values
export const caseStorageFormFactorsTable = pgTable("case_storage_form_factors", {
        caseId: integer("case_id")
            .notNull()
            .references(() => pcCasesTable.componentId, {onDelete: "cascade", onUpdate: "cascade" }),
        formFactor: text("form_factor").notNull(),
        numSlots: integer("num_slots").notNull(),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.caseId, t.formFactor] }),
    }),
);

export const casePsFormFactorsTable = pgTable( "case_ps_form_factors", {
        caseId: integer("case_id")
            .notNull()
            .references(() => pcCasesTable.componentId, { onDelete: "cascade", onUpdate: "cascade"}),
        formFactor: text("form_factor").notNull(),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.caseId, t.formFactor] }),
    }),
);

export const caseMoboFormFactorsTable = pgTable("case_mobo_form_factors", {
        caseId: integer("case_id")
            .notNull()
            .references(() => pcCasesTable.componentId, { onDelete: "cascade", onUpdate: "cascade"}),
        formFactor: text("form_factor").notNull(),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.caseId, t.formFactor] }),
    }),
);

export const coolersTable = pgTable("cooler", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    type: text("type").notNull(),
    height: numeric("height").notNull(),
    maxTdpSupported: numeric("max_tdp_supported").notNull(),
});

// Cooler multi-values
export const coolerCPUSocketsTable = pgTable("cooler_cpu_sockets", {
        coolerId: integer("cooler_id")
            .notNull()
            .references(() => coolersTable.componentId, { onDelete: "cascade", onUpdate: "cascade" }),
        socket: text("socket").notNull(),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.coolerId, t.socket] }),
    })
);

export const motherboardsTable = pgTable("motherboard", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),

    socket: text("socket").notNull(),
    chipset: text("chipset").notNull(),
    formFactor: text("form_factor").notNull(),
    ramType: text("ram_type").notNull(),
    numRamSlots: integer("num_ram_slots").notNull(),
    maxRamCapacity: numeric("max_ram_capacity").notNull(),
});

export const storageTable = pgTable("storage", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    type: text("type").notNull(),
    capacity: numeric("capacity").notNull(),
    formFactor: text("form_factor").notNull(),
});

// Other Components
export const memoryCardsTable = pgTable("memory_card", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    numSlots: integer("num_slots").notNull(),
    interface: text("interface").notNull(),
});

export const opticalDrivesTable = pgTable("optical_drive", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    formFactor: text("form_factor").notNull(),
    type: text("type").notNull(),
    interface: text("interface").notNull(),
    writeSpeed: numeric("write_speed").notNull(),
    readSpeed: numeric("read_speed").notNull(),
});

export const soundCardsTable = pgTable("sound_card", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    sampleRate: numeric("sample_rate").notNull(),
    bitDepth: numeric("bit_depth").notNull(),
    chipset: text("chipset").notNull(),
    interface: text("interface").notNull(),
    channel: text("channel").notNull(),
});

export const cablesTable = pgTable("cables", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    lengthCm: numeric("length_cm").notNull(),
    type: text("type").notNull(),
});

export const networkAdaptersTable = pgTable("network_adapter", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    wifiVersion: text("wifi_version").notNull(),
    interface: text("interface").notNull(),
    numAntennas: integer("num_antennas").notNull(),
});

export const networkCardsTable = pgTable("network_card", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    numPorts: integer("num_ports").notNull(),
    speed: numeric("speed").notNull(),
    interface: text("interface").notNull(),
});

export type componentItem = typeof componentsTable.$inferSelect;
export type componentInsert = typeof componentsTable.$inferInsert;

export type cpuItem = typeof CPUTable.$inferSelect;
export type cpuInsert = typeof CPUTable.$inferInsert;

export type gpuItem = typeof GPUTable.$inferSelect;
export type gpuInsert = typeof GPUTable.$inferInsert;

export type memoryItem = typeof memoryTable.$inferSelect;
export type memoryInsert = typeof memoryTable.$inferInsert;

export type powerSupplyItem = typeof powerSupplyTable.$inferSelect;
export type powerSupplyInsert = typeof powerSupplyTable.$inferInsert;

export type caseItem = typeof pcCasesTable.$inferSelect;
export type caseInsert = typeof pcCasesTable.$inferInsert;

export type caseStorageFormFactorsItem = typeof caseStorageFormFactorsTable.$inferSelect;
export type caseStorageFormFactorsInsert = typeof caseStorageFormFactorsTable.$inferInsert;

export type casePsFormFactorsItem = typeof casePsFormFactorsTable.$inferSelect;
export type casePsFormFactorsInsert = typeof casePsFormFactorsTable.$inferInsert;

export type caseMoboFormFactorsItem = typeof caseMoboFormFactorsTable.$inferSelect;
export type caseMoboFormFactorsInsert = typeof caseMoboFormFactorsTable.$inferInsert;

export type coolerItem = typeof coolersTable.$inferSelect;
export type coolerInsert = typeof coolersTable.$inferInsert;

export type coolerCPUSocketsItem = typeof coolerCPUSocketsTable.$inferSelect;
export type coolerCPUSocketsInsert = typeof coolerCPUSocketsTable.$inferInsert;

export type motherboardItem = typeof motherboardsTable.$inferSelect;
export type motherboardInsert = typeof motherboardsTable.$inferInsert;

export type storageItem = typeof storageTable.$inferSelect;
export type storageInsert = typeof storageTable.$inferInsert

export type memoryCardItem = typeof memoryCardsTable.$inferSelect;
export type memoryCardInsert = typeof memoryCardsTable.$inferInsert;

export type opticalDriveItem = typeof opticalDrivesTable.$inferSelect;
export type opticalDriveInsert = typeof opticalDrivesTable.$inferInsert;

export type soundCardItem = typeof soundCardsTable.$inferSelect;
export type soundCardInsert = typeof soundCardsTable.$inferInsert;

export type cablesItem = typeof cablesTable.$inferSelect;
export type cablesInsert = typeof cablesTable.$inferInsert;

export type networkAdapterItem = typeof networkAdaptersTable.$inferSelect;
export type networkAdapterInsert = typeof networkAdaptersTable.$inferInsert;

export type networkCardItem = typeof networkCardsTable.$inferSelect;
export type networkCardInsert = typeof networkCardsTable.$inferInsert;

