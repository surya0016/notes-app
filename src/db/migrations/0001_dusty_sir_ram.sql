CREATE TABLE "notesTags" (
	"notesId" uuid NOT NULL,
	"tagsId" integer NOT NULL,
	CONSTRAINT "notesTags_notesId_tagsId_pk" PRIMARY KEY("notesId","tagsId")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" integer PRIMARY KEY NOT NULL,
	"tag_name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "userId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "notesTags" ADD CONSTRAINT "notesTags_notesId_notes_id_fk" FOREIGN KEY ("notesId") REFERENCES "public"."notes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notesTags" ADD CONSTRAINT "notesTags_tagsId_tags_id_fk" FOREIGN KEY ("tagsId") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;