CREATE TYPE "public"."role_scope" AS ENUM('PLATFORM', 'INSTITUTE');--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inst_id" uuid NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"email" varchar(255),
	"password" varchar(255) NOT NULL,
	"role_id" uuid NOT NULL,
	"is_temp_password" boolean DEFAULT true NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_on" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "inst" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text,
	"contact_phone" varchar(20),
	"contact_email" varchar(255),
	"created_by" uuid,
	"updated_by" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_on" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inst_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"scope" "role_scope" NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_on" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_on" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "role_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_inst_id_inst_id_fk" FOREIGN KEY ("inst_id") REFERENCES "public"."inst"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inst" ADD CONSTRAINT "inst_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inst" ADD CONSTRAINT "inst_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;