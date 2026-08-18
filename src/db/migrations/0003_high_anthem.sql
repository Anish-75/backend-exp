ALTER TABLE "user" DROP CONSTRAINT "user_phone_number_unique";--> statement-breakpoint
ALTER TABLE "inst" DROP CONSTRAINT "inst_contact_phone_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_inst_id_inst_id_fk";
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_role_id_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_created_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_updated_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "inst" DROP CONSTRAINT "inst_created_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "inst" DROP CONSTRAINT "inst_updated_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "inst_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "is_temp_password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "is_active" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "is_archived" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "inst" ALTER COLUMN "code" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "inst" ALTER COLUMN "contact_phone" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "inst" ALTER COLUMN "contact_phone" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "inst" ALTER COLUMN "contact_phone" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "inst" ALTER COLUMN "created_on" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "inst" ALTER COLUMN "created_on" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "inst" ALTER COLUMN "updated_on" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "inst" ALTER COLUMN "updated_on" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "email_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "phone_number";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "created_on";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "updated_on";--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");