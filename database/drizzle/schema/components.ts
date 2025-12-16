import { pgTable, serial, integer, text, numeric, boolean, date, primaryKey } from "drizzle-orm/pg-core";

export const componentsTable = pgTable("components", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    brand: text("brand").notNull(),
    price: numeric("price").notNull(),
    imgUrl: text("img_url"),
});

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

export const pcCaseTable = pgTable("pc_case", {
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
            .references(() => pcCaseTable.componentId, {onDelete: "cascade", onUpdate: "cascade" }),
        formFactor: text("form_factor").notNull(),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.caseId, t.formFactor] }),
    }),
);

export const casePsFormFactorsTable = pgTable( "case_ps_form_factors", {
        caseId: integer("case_id")
            .notNull()
            .references(() => pcCaseTable.componentId, { onDelete: "cascade", onUpdate: "cascade"}),
        formFactor: text("form_factor").notNull(),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.caseId, t.formFactor] }),
    }),
);

export const caseMoboFormFactorsTable = pgTable("case_mobo_form_factors", {
        caseId: integer("case_id")
            .notNull()
            .references(() => pcCaseTable.componentId, { onDelete: "cascade", onUpdate: "cascade"}),
        formFactor: text("form_factor").notNull(),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.caseId, t.formFactor] }),
    }),
);

export const coolerTable = pgTable("cooler", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    type: text("type").notNull(),
    height: numeric("height").notNull(),
    maxTdpSupported: numeric("max_tdp_supported").notNull(),
});

// Cooler multi-values
export const coolerCPUSocketsTable = pgTable("cooler_cpu_sockets", {
        cooler_id: integer("cooler_id")
            .notNull()
            .references(() => coolerTable.componentId, { onDelete: "cascade", onUpdate: "cascade" }),
        socket: text("socket").notNull(),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.cooler_id, t.socket] }),
    })
);

export const motherboardTable = pgTable("motherboard", {
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
export const memoryCardTable = pgTable("memory_card", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    numSlots: integer("num_slots").notNull(),
    interface: text("interface").notNull(),
});

export const opticalDriveTable = pgTable("optical_drive", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    formFactor: text("form_factor").notNull(),
    type: text("type").notNull(),
    interface: text("interface").notNull(),
    writeSpeed: numeric("write_speed").notNull(),
    readSpeed: numeric("read_speed").notNull(),
});

export const soundCardTable = pgTable("sound_card", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    sampleRate: numeric("sample_rate").notNull(),
    bitDepth: numeric("bit_depth").notNull(),
    chipset: text("chipset").notNull(),
    interface: text("interface").notNull(),
});

// SoundCard multi-values
export const soundCardChannelsTable = pgTable("sound_card_channels", {
        soundCardId: integer("sound_card_id")
            .notNull()
            .references(() => soundCardTable.componentId, { onDelete: "cascade", onUpdate: "cascade" }),
        channel: text("channel").notNull(),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.soundCardId, t.channel] }),
    })
);

export const cablesTable = pgTable("cables", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    lengthCm: numeric("length_cm").notNull(),
    type: text("type").notNull(),
});

export const networkAdapterTable = pgTable("network_adapter", {
    componentId: integer("component_id")
        .primaryKey()
        .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    wifiVersion: text("wifi_version").notNull(),
    interface: text("interface").notNull(),
    numAntennas: integer("num_antennas").notNull(),
});

export const networkCardTable = pgTable("network_card", {
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

export type caseItem = typeof pcCaseTable.$inferSelect;
export type caseInsert = typeof pcCaseTable.$inferInsert;

export type caseStorageFormFactorsItem = typeof caseStorageFormFactorsTable.$inferSelect;
export type caseStorageFormFactorsInsert = typeof caseStorageFormFactorsTable.$inferInsert;

export type casePsFormFactorsItem = typeof casePsFormFactorsTable.$inferSelect;
export type casePsFormFactorsInsert = typeof casePsFormFactorsTable.$inferInsert;

export type caseMoboFormFactorsItem = typeof caseMoboFormFactorsTable.$inferSelect;
export type caseMoboFormFactorsInsert = typeof caseMoboFormFactorsTable.$inferInsert;

export type coolerItem = typeof coolerTable.$inferSelect;
export type coolerInsert = typeof coolerTable.$inferInsert;

export type coolerCPUSocketsItem = typeof coolerCPUSocketsTable.$inferSelect;
export type coolerCPUSocketsInsert = typeof coolerCPUSocketsTable.$inferInsert;

export type motherboardItem = typeof motherboardTable.$inferSelect;
export type motherboardInsert = typeof motherboardTable.$inferInsert;

export type storageItem = typeof storageTable.$inferSelect;
export type storageInsert = typeof storageTable.$inferInsert

export type memoryCardItem = typeof memoryCardTable.$inferSelect;
export type memoryCardInsert = typeof memoryCardTable.$inferInsert;

export type opticalDriveItem = typeof opticalDriveTable.$inferSelect;
export type opticalDriveInsert = typeof opticalDriveTable.$inferInsert;

export type soundCardItem = typeof soundCardTable.$inferSelect;
export type soundCardInsert = typeof soundCardTable.$inferInsert;

export type soundCardChannelsItem = typeof soundCardChannelsTable.$inferSelect;
export type soundCardChannelsInsert = typeof soundCardChannelsTable.$inferInsert;

export type cablesItem = typeof cablesTable.$inferSelect;
export type cablesInsert = typeof cablesTable.$inferInsert;

export type networkAdapterItem = typeof networkAdapterTable.$inferSelect;
export type networkAdapterInsert = typeof networkAdapterTable.$inferInsert;

export type networkCardItem = typeof networkCardTable.$inferSelect;
export type networkCardInsert = typeof networkCardTable.$inferInsert;

