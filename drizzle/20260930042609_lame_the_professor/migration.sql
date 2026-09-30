CREATE TYPE "issuePriority" AS ENUM('High', 'Medium', 'Low');--> statement-breakpoint
CREATE TABLE "commments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"comment" varchar NOT NULL,
	"issueId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"deteledAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"name" varchar(400) NOT NULL,
	"description" varchar NOT NULL,
	"projectId" uuid NOT NULL,
	"priority" "issuePriority",
	"dueDate" timestamp NOT NULL,
	"assigneeId" uuid NOT NULL,
	"labels" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"issueId" uuid NOT NULL,
	"assigneeId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"name" varchar(255) NOT NULL,
	"description" varchar(500) NOT NULL,
	"ownerId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deleteAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"deletedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "commments" ADD CONSTRAINT "commments_issueId_issues_id_fkey" FOREIGN KEY ("issueId") REFERENCES "issues"("id");--> statement-breakpoint
ALTER TABLE "commments" ADD CONSTRAINT "commments_userId_users_id_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_projectId_projects_id_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id");--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_assigneeId_users_id_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_issueId_issues_id_fkey" FOREIGN KEY ("issueId") REFERENCES "issues"("id");--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_assigneeId_users_id_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_ownerId_users_id_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id");