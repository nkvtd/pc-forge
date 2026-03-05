CREATE TABLE "build_component" (
	"build_id" integer NOT NULL,
	"component_id" integer NOT NULL,
	"num_components" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "build_component_build_id_component_id_pk" PRIMARY KEY("build_id","component_id")
);
--> statement-breakpoint
CREATE TABLE "build" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"created_at" date NOT NULL,
	"description" text,
	"total_price" numeric NOT NULL,
	"is_approved" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorite_build" (
	"build_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "favorite_build_build_id_user_id_pk" PRIMARY KEY("build_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "rating_build" (
	"build_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"value" numeric NOT NULL,
	CONSTRAINT "rating_build_build_id_user_id_pk" PRIMARY KEY("build_id","user_id"),
	CONSTRAINT "check_value" CHECK ("rating_build"."value" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE TABLE "review" (
	"id" serial PRIMARY KEY NOT NULL,
	"build_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" date NOT NULL,
	CONSTRAINT "review_build_id_user_id_unique" UNIQUE("build_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "cpu" (
	"component_id" integer PRIMARY KEY NOT NULL,
	"socket" text NOT NULL,
	"cores" integer NOT NULL,
	"threads" integer NOT NULL,
	"base_clock" numeric NOT NULL,
	"boost_clock" numeric,
	"tdp" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gpu" (
	"component_id" integer PRIMARY KEY NOT NULL,
	"vram" numeric NOT NULL,
	"tdp" numeric NOT NULL,
	"base_clock" numeric,
	"boost_clock" numeric,
	"chipset" text NOT NULL,
	"length" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cables" (
	"component_id" integer PRIMARY KEY NOT NULL,
	"length_cm" numeric NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "case_mobo_form_factors" (
	"case_id" integer NOT NULL,
	"form_factor" text NOT NULL,
	CONSTRAINT "case_mobo_form_factors_case_id_form_factor_pk" PRIMARY KEY("case_id","form_factor")
);
--> statement-breakpoint
CREATE TABLE "case_ps_form_factors" (
	"case_id" integer NOT NULL,
	"form_factor" text NOT NULL,
	CONSTRAINT "case_ps_form_factors_case_id_form_factor_pk" PRIMARY KEY("case_id","form_factor")
);
--> statement-breakpoint
CREATE TABLE "case_storage_form_factors" (
	"case_id" integer NOT NULL,
	"form_factor" text NOT NULL,
	"num_slots" integer NOT NULL,
	CONSTRAINT "case_storage_form_factors_case_id_form_factor_pk" PRIMARY KEY("case_id","form_factor")
);
--> statement-breakpoint
CREATE TABLE "components" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"brand" text NOT NULL,
	"price" numeric NOT NULL,
	"img_url" text,
	"type" text NOT NULL,
	CONSTRAINT "check_type" CHECK ("components"."type" in 
      ('cpu', 'gpu', 'memory', 'storage', 'power_supply', 'motherboard', 'case', 'cooler', 'memory_card', 'optical_drive', 'sound_card', 'cables', 'network_adapter', 'network_card'))
);
--> statement-breakpoint
CREATE TABLE "cooler_cpu_sockets" (
	"cooler_id" integer NOT NULL,
	"socket" text NOT NULL,
	CONSTRAINT "cooler_cpu_sockets_cooler_id_socket_pk" PRIMARY KEY("cooler_id","socket")
);
--> statement-breakpoint
CREATE TABLE "cooler" (
	"component_id" integer PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"height" numeric NOT NULL,
	"max_tdp_supported" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memory_card" (
	"component_id" integer PRIMARY KEY NOT NULL,
	"num_slots" integer NOT NULL,
	"interface" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memory" (
	"component_id" integer PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"speed" numeric NOT NULL,
	"capacity" numeric NOT NULL,
	"modules" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "motherboard" (
	"component_id" integer PRIMARY KEY NOT NULL,
	"socket" text NOT NULL,
	"chipset" text NOT NULL,
	"form_factor" text NOT NULL,
	"ram_type" text NOT NULL,
	"num_ram_slots" integer NOT NULL,
	"max_ram_capacity" numeric NOT NULL,
	"pci_express_slots" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "network_adapter" (
	"component_id" integer PRIMARY KEY NOT NULL,
	"wifi_version" text NOT NULL,
	"interface" text NOT NULL,
	"num_antennas" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "network_card" (
	"component_id" integer PRIMARY KEY NOT NULL,
	"num_ports" integer NOT NULL,
	"speed" numeric NOT NULL,
	"interface" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "optical_drive" (
	"component_id" integer PRIMARY KEY NOT NULL,
	"form_factor" text NOT NULL,
	"type" text NOT NULL,
	"interface" text NOT NULL,
	"write_speed" numeric NOT NULL,
	"read_speed" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pc_case" (
	"component_id" integer PRIMARY KEY NOT NULL,
	"cooler_max_height" numeric NOT NULL,
	"gpu_max_length" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "power_supply" (
	"component_id" integer PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"wattage" numeric NOT NULL,
	"form_factor" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sound_card" (
	"component_id" integer PRIMARY KEY NOT NULL,
	"sample_rate" numeric NOT NULL,
	"bit_depth" numeric NOT NULL,
	"chipset" text NOT NULL,
	"interface" text NOT NULL,
	"channel" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "storage" (
	"component_id" integer PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"capacity" numeric NOT NULL,
	"form_factor" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admins" (
	"user_id" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suggestions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"admin_id" integer,
	"link" text NOT NULL,
	"admin_comment" text,
	"description" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"component_type" text NOT NULL,
	CONSTRAINT "check_status" CHECK ("suggestions"."status" in ('pending', 'approved', 'rejected')),
	CONSTRAINT "check_type" CHECK ("suggestions"."component_type" in 
      ('cpu', 'gpu', 'memory', 'storage', 'power_supply', 'motherboard', 'case', 'cooler', 'memory_card', 'optical_drive', 'sound_card', 'cables', 'network_adapter', 'network_card'))
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "build_component" ADD CONSTRAINT "build_component_build_id_build_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."build"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "build_component" ADD CONSTRAINT "build_component_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "build" ADD CONSTRAINT "build_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "favorite_build" ADD CONSTRAINT "favorite_build_build_id_build_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."build"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "favorite_build" ADD CONSTRAINT "favorite_build_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "rating_build" ADD CONSTRAINT "rating_build_build_id_build_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."build"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "rating_build" ADD CONSTRAINT "rating_build_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_build_id_build_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."build"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cpu" ADD CONSTRAINT "cpu_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "gpu" ADD CONSTRAINT "gpu_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cables" ADD CONSTRAINT "cables_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "case_mobo_form_factors" ADD CONSTRAINT "case_mobo_form_factors_case_id_pc_case_component_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."pc_case"("component_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "case_ps_form_factors" ADD CONSTRAINT "case_ps_form_factors_case_id_pc_case_component_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."pc_case"("component_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "case_storage_form_factors" ADD CONSTRAINT "case_storage_form_factors_case_id_pc_case_component_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."pc_case"("component_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cooler_cpu_sockets" ADD CONSTRAINT "cooler_cpu_sockets_cooler_id_cooler_component_id_fk" FOREIGN KEY ("cooler_id") REFERENCES "public"."cooler"("component_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cooler" ADD CONSTRAINT "cooler_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "memory_card" ADD CONSTRAINT "memory_card_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "memory" ADD CONSTRAINT "memory_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "motherboard" ADD CONSTRAINT "motherboard_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "network_adapter" ADD CONSTRAINT "network_adapter_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "network_card" ADD CONSTRAINT "network_card_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "optical_drive" ADD CONSTRAINT "optical_drive_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "pc_case" ADD CONSTRAINT "pc_case_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "power_supply" ADD CONSTRAINT "power_supply_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "sound_card" ADD CONSTRAINT "sound_card_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "storage" ADD CONSTRAINT "storage_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_admin_id_admins_user_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("user_id") ON DELETE set null ON UPDATE cascade;

CREATE OR REPLACE FUNCTION get_report_top_components()
    RETURNS TABLE (
                      type TEXT,
                      brand TEXT,
                      name TEXT,
                      usage_count BIGINT,
                      avg_build_rating NUMERIC
                  )
    LANGUAGE sql
AS $$
SELECT
    c.type,
    c.brand,
    c.name,
    COUNT(bc.component_id) AS usage_count,
    AVG(rb.value) AS avg_build_rating
FROM components c
         JOIN build_component bc ON c.id = bc.component_id
         JOIN build b ON bc.build_id = b.id
         JOIN rating_build rb ON b.id = rb.build_id
WHERE b.created_at >= CURRENT_DATE - INTERVAL '1 year'
GROUP BY c.type, c.brand, c.name
HAVING AVG(rb.value) >= 4.5
ORDER BY usage_count DESC, avg_build_rating DESC
LIMIT 15;
$$;

CREATE OR REPLACE FUNCTION get_report_user_reputation_leaderboard()
    RETURNS TABLE (
                      username TEXT,
                      email TEXT,
                      approved_builds_count BIGINT,
                      total_favorites_received BIGINT,
                      avg_rating_received NUMERIC,
                      reputation_score NUMERIC
                  )
    LANGUAGE sql
AS $$
WITH build_stats AS (
    SELECT
        b.id AS build_id,
        b.user_id,
        COUNT(DISTINCT fb.user_id) AS favorites_count,
        AVG(rb.value) AS avg_rating
    FROM build b
             LEFT JOIN favorite_build fb ON b.id = fb.build_id
             LEFT JOIN rating_build rb ON b.id = rb.build_id
    WHERE b.is_approved = TRUE
    GROUP BY b.id, b.user_id
),
     user_stats AS (
         SELECT
             user_id,
             COUNT(build_id) AS approved_builds_count,
             COALESCE(SUM(favorites_count), 0) AS total_favorites_received,
             AVG(avg_rating) AS avg_rating_received
         FROM build_stats
         GROUP BY user_id
     )
SELECT
    u.username,
    u.email,
    us.approved_builds_count,
    us.total_favorites_received,
    ROUND(CAST(COALESCE(us.avg_rating_received, 0) AS numeric), 2) AS avg_rating_received,
    (
        (us.approved_builds_count * 10) +
        (us.total_favorites_received * 5) +
        (COALESCE(us.avg_rating_received, 0) * 20)
        ) AS reputation_score
FROM user_stats us
         JOIN users u ON u.id = us.user_id
ORDER BY reputation_score DESC
LIMIT 10;
$$;

CREATE OR REPLACE FUNCTION get_report_price_to_performance()
    RETURNS TABLE (
                      build_name TEXT,
                      cpu_model TEXT,
                      gpu_model TEXT,
                      total_price NUMERIC,
                      performance_score NUMERIC,
                      price_to_performance_index NUMERIC
                  )
    LANGUAGE sql
AS $$
WITH cpu_per_build AS (
    SELECT
        b.id AS build_id,
        c.name AS cpu_model,
        cpu.cores,
        cpu.base_clock
    FROM build b
             JOIN build_component bc ON b.id = bc.build_id
             JOIN components c ON bc.component_id = c.id
             JOIN cpu ON c.id = cpu.component_id
    WHERE LOWER(c.type) = LOWER('CPU')
),
     gpu_per_build AS (
         SELECT
             b.id AS build_id,
             c.name AS gpu_model,
             gpu.vram
         FROM build b
                  JOIN build_component bc ON b.id = bc.build_id
                  JOIN components c ON bc.component_id = c.id
                  JOIN gpu ON c.id = gpu.component_id
         WHERE LOWER(c.type) = LOWER('GPU')
     )
SELECT
    b.name AS build_name,
    cpu.cpu_model,
    gpu.gpu_model,
    b.total_price,
    (cpu.cores * cpu.base_clock + gpu.vram * 100) AS performance_score,
    ROUND(
            CAST(
                    (cpu.cores * cpu.base_clock + gpu.vram * 100) / NULLIF(b.total_price, 0)
                AS numeric),
            4
    ) AS price_to_performance_index
FROM build b
         JOIN cpu_per_build cpu ON b.id = cpu.build_id
         JOIN gpu_per_build gpu ON b.id = gpu.build_id
WHERE b.total_price > 0
ORDER BY price_to_performance_index DESC
LIMIT 20;
$$;

CREATE OR REPLACE FUNCTION get_report_budget_tier_popularity()
    RETURNS TABLE (
                      price_tier TEXT,
                      builds_count BIGINT,
                      avg_favorites NUMERIC,
                      avg_rating NUMERIC,
                      unique_builders BIGINT,
                      engagement_score NUMERIC
                  )
    LANGUAGE sql
AS $$
WITH price_tier_builds AS (
    SELECT
        b.id AS build_id,
        b.user_id,
        b.total_price,
        CASE
            WHEN b.total_price < 500 THEN 'Budget'
            WHEN b.total_price < 1000 THEN 'Mid-Range'
            WHEN b.total_price < 2000 THEN 'High-End'
            ELSE 'Enthusiast'
            END AS price_tier
    FROM build b
    WHERE b.is_approved = TRUE
      AND b.created_at >= CURRENT_DATE - INTERVAL '6 months'
),
     favorites AS (
         SELECT
             build_id,
             COUNT(DISTINCT user_id) AS favorites_count
         FROM favorite_build
         GROUP BY build_id
     ),
     engagement_stats AS (
         SELECT
             ptb.price_tier,
             COUNT(DISTINCT ptb.build_id) AS builds_count,
             AVG(COALESCE(f.favorites_count, 0)) AS avg_favorites,
             AVG(rb.value) AS avg_rating,
             COUNT(DISTINCT ptb.user_id) AS unique_builders
         FROM price_tier_builds ptb
                  LEFT JOIN rating_build rb ON ptb.build_id = rb.build_id
                  LEFT JOIN favorites f ON ptb.build_id = f.build_id
         GROUP BY ptb.price_tier
     )
SELECT
    price_tier,
    builds_count,
    ROUND(CAST(avg_favorites AS numeric), 1) AS avg_favorites,
    ROUND(CAST(COALESCE(avg_rating, 0) AS numeric), 2) AS avg_rating,
    unique_builders,
    ROUND(
            CAST(
                    (builds_count * 2) +
                    (avg_favorites * 3) +
                    (COALESCE(avg_rating, 0) * 10) +
                    (unique_builders * 1.5)
                AS numeric),
            2
    ) AS engagement_score
FROM engagement_stats
ORDER BY engagement_score DESC
LIMIT 15;
$$;

CREATE OR REPLACE FUNCTION get_report_compatibility()
    RETURNS TABLE (
                      cpu_combo TEXT,
                      motherboard_chipset TEXT,
                      total_builds BIGINT,
                      avg_satisfaction NUMERIC,
                      success_rate NUMERIC
                  )
    LANGUAGE sql
AS $$
WITH cpu_mobo_pairs AS (
    SELECT
        cpu_comp.brand AS cpu_brand,
        cpu_comp.name AS cpu_model,
        mobo.chipset AS motherboard_chipset,
        b.id AS build_id,
        b.user_id,
        b.created_at
    FROM build b
             JOIN build_component bc_cpu ON b.id = bc_cpu.build_id
             JOIN components cpu_comp ON bc_cpu.component_id = cpu_comp.id
             JOIN cpu ON cpu.component_id = cpu_comp.id
             JOIN build_component bc_mobo ON b.id = bc_mobo.build_id
             JOIN components mobo_comp ON bc_mobo.component_id = mobo_comp.id
             JOIN motherboard mobo ON mobo.component_id = mobo_comp.id
    WHERE b.is_approved = TRUE
),
     recent_activity AS (
         SELECT DISTINCT build_id
         FROM review
         WHERE created_at >= CURRENT_DATE - INTERVAL '3 months'
     ),
     pair_metrics AS (
         SELECT
             cmp.cpu_brand,
             cmp.cpu_model,
             cmp.motherboard_chipset,
             COUNT(DISTINCT cmp.build_id) AS total_builds,
             AVG(COALESCE(rb.value, 0)) AS avg_satisfaction,
             COUNT(DISTINCT ra.build_id) AS active_builds
         FROM cpu_mobo_pairs cmp
                  LEFT JOIN rating_build rb ON cmp.build_id = rb.build_id
                  LEFT JOIN recent_activity ra ON cmp.build_id = ra.build_id
         GROUP BY
             cmp.cpu_brand,
             cmp.cpu_model,
             cmp.motherboard_chipset
         HAVING COUNT(DISTINCT cmp.build_id) >= 2
     )
SELECT
    CONCAT(cpu_brand, ' ', cpu_model) AS cpu_combo,
    motherboard_chipset,
    total_builds,
    ROUND(CAST(avg_satisfaction AS numeric), 2) AS avg_satisfaction,
    ROUND(
            CAST(
                    (avg_satisfaction / 5.0) * 0.6 +
                    (CAST(active_builds AS DECIMAL) / total_builds) * 0.4
                AS numeric),
            3
    ) AS success_rate
FROM pair_metrics
ORDER BY success_rate DESC, total_builds DESC
LIMIT 15;
$$;

CREATE OR REPLACE FUNCTION get_report_storage_optimization()
    RETURNS TABLE (
                      config_type TEXT,
                      ssd_brand TEXT,
                      builds_count BIGINT,
                      avg_storage_cost NUMERIC,
                      avg_total_capacity_gb NUMERIC,
                      avg_build_rating NUMERIC,
                      storage_cost_pct NUMERIC,
                      optimization_score NUMERIC
                  )
    LANGUAGE sql
AS $$
WITH storage_configs AS (
    SELECT
        b.id AS build_id,
        b.total_price,

        ssd_comp.brand AS ssd_brand,
        ssd_storage.capacity AS ssd_capacity,
        ssd_comp.price AS ssd_price,

        hdd_storage.capacity AS hdd_capacity,
        hdd_comp.price AS hdd_price,

        CASE
            WHEN hdd_storage.capacity IS NULL THEN 'SSD-Only'
            WHEN ssd_storage.capacity < 512 THEN 'SSD-Boot-HDD-Storage'
            ELSE 'SSD-Primary-HDD-Archive'
            END AS config_type
    FROM build b
             JOIN build_component bc_ssd ON b.id = bc_ssd.build_id
             JOIN components ssd_comp ON bc_ssd.component_id = ssd_comp.id
             JOIN storage ssd_storage ON ssd_storage.component_id = ssd_comp.id

             LEFT JOIN build_component bc_hdd ON b.id = bc_hdd.build_id
             LEFT JOIN components hdd_comp ON bc_hdd.component_id = hdd_comp.id
             LEFT JOIN storage hdd_storage ON hdd_storage.component_id = hdd_comp.id

    WHERE ssd_comp.type = 'storage'
      AND b.is_approved = TRUE
      AND b.created_at >= CURRENT_DATE - INTERVAL '1 year'

      AND (
        ssd_storage.type ILIKE '%nvme%'
            OR ssd_storage.type ILIKE '%ssd%'
            OR ssd_storage.type ILIKE '%m.2%'
            OR ssd_storage.form_factor ILIKE '%m.2%'
        )
      AND (
        hdd_storage.component_id IS NULL
            OR hdd_storage.type ILIKE '%hdd%'
            OR hdd_storage.form_factor ILIKE '%3.5%'
        )
),
     config_performance AS (
         SELECT
             sc.config_type,
             sc.ssd_brand,
             COUNT(sc.build_id) AS builds_count,
             AVG(sc.ssd_price + COALESCE(sc.hdd_price, 0)) AS avg_storage_cost,
             AVG(sc.ssd_capacity + COALESCE(sc.hdd_capacity, 0)) AS avg_total_capacity,
             AVG(rb.value) AS avg_build_rating,
             AVG((sc.ssd_price + COALESCE(sc.hdd_price, 0)) / NULLIF(sc.total_price, 0)) AS storage_cost_ratio
         FROM storage_configs sc
                  LEFT JOIN rating_build rb ON sc.build_id = rb.build_id
         GROUP BY sc.config_type, sc.ssd_brand
         HAVING COUNT(sc.build_id) >= 2
     )
SELECT
    config_type,
    ssd_brand,
    builds_count,
    ROUND(CAST(avg_storage_cost AS numeric), 2) AS avg_storage_cost,
    ROUND(CAST(avg_total_capacity AS numeric), 0) AS avg_total_capacity_gb,
    ROUND(CAST(COALESCE(avg_build_rating, 0) AS numeric), 2) AS avg_build_rating,
    ROUND(CAST(COALESCE(storage_cost_ratio, 0) * 100 AS numeric), 1) AS storage_cost_pct,
    ROUND(
            CAST(
                    (COALESCE(avg_build_rating, 0) / 5.0 * 40) +
                    (avg_total_capacity / NULLIF(avg_storage_cost, 0) * 0.5) +
                    ((1 - COALESCE(storage_cost_ratio, 0)) * 30) +
                    (LN(CAST(builds_count + 1 AS numeric)) * 5)
                AS numeric),
            2
    ) AS optimization_score
FROM config_performance
ORDER BY optimization_score DESC, builds_count DESC
LIMIT 15;
$$;