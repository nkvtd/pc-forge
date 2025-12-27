CREATE TABLE "build_component" (
	"build_id" integer NOT NULL,
	"component_id" integer NOT NULL,
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