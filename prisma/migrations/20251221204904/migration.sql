/*
  Warnings:

  - You are about to drop the column `organizationId` on the `invitation` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `activeOrganizationId` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `testimonial_links` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `testimonial_links` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `testimonials` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `testimonials` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `widget_configs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `widget_configs` table. All the data in the column will be lost.
  - You are about to drop the `organization` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[projectId]` on the table `testimonial_links` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId]` on the table `widget_configs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectId` to the `invitation` table without a default value. This is not possible if the table is not empty.
  - Made the column `role` on table `invitation` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `projectId` to the `member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `testimonial_links` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `testimonials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `widget_configs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "invitation" DROP CONSTRAINT "invitation_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "member" DROP CONSTRAINT "member_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "testimonial_links" DROP CONSTRAINT "testimonial_links_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "testimonial_links" DROP CONSTRAINT "testimonial_links_userId_fkey";

-- DropForeignKey
ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_userId_fkey";

-- DropForeignKey
ALTER TABLE "widget_configs" DROP CONSTRAINT "widget_configs_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "widget_configs" DROP CONSTRAINT "widget_configs_userId_fkey";

-- DropIndex
DROP INDEX "invitation_organizationId_idx";

-- DropIndex
DROP INDEX "member_organizationId_idx";

-- DropIndex
DROP INDEX "testimonial_links_organizationId_key";

-- DropIndex
DROP INDEX "testimonial_links_userId_key";

-- DropIndex
DROP INDEX "testimonials_organizationId_idx";

-- DropIndex
DROP INDEX "testimonials_userId_idx";

-- DropIndex
DROP INDEX "widget_configs_organizationId_key";

-- DropIndex
DROP INDEX "widget_configs_userId_key";

-- AlterTable
ALTER TABLE "invitation" DROP COLUMN "organizationId",
ADD COLUMN     "projectId" TEXT NOT NULL,
ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'member';

-- AlterTable
ALTER TABLE "member" DROP COLUMN "organizationId",
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "session" DROP COLUMN "activeOrganizationId";

-- AlterTable
ALTER TABLE "testimonial_links" DROP COLUMN "organizationId",
DROP COLUMN "userId",
ADD COLUMN     "projectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "testimonials" DROP COLUMN "organizationId",
DROP COLUMN "userId",
ADD COLUMN     "projectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "activeProjectId" TEXT;

-- AlterTable
ALTER TABLE "widget_configs" DROP COLUMN "organizationId",
DROP COLUMN "userId",
ADD COLUMN     "projectId" TEXT NOT NULL;

-- DropTable
DROP TABLE "organization";

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonial_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "cancelled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "description" TEXT,

    CONSTRAINT "testimonial_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_slug_key" ON "project"("slug");

-- CreateIndex
CREATE INDEX "project_userId_idx" ON "project"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "testimonial_tokens_token_key" ON "testimonial_tokens"("token");

-- CreateIndex
CREATE INDEX "testimonial_tokens_token_idx" ON "testimonial_tokens"("token");

-- CreateIndex
CREATE INDEX "invitation_projectId_idx" ON "invitation"("projectId");

-- CreateIndex
CREATE INDEX "member_projectId_idx" ON "member"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "testimonial_links_projectId_key" ON "testimonial_links"("projectId");

-- CreateIndex
CREATE INDEX "testimonials_projectId_idx" ON "testimonials"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "widget_configs_projectId_key" ON "widget_configs"("projectId");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonial_links" ADD CONSTRAINT "testimonial_links_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "widget_configs" ADD CONSTRAINT "widget_configs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonial_tokens" ADD CONSTRAINT "testimonial_tokens_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
