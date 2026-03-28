/*
  Warnings:

  - You are about to drop the column `charityPercent` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionEnd` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'inactive',
    "subscriptionPlan" TEXT,
    "charityId" TEXT,
    "isWinner" BOOLEAN NOT NULL DEFAULT false,
    "winningAmount" REAL NOT NULL DEFAULT 0,
    "proof" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    CONSTRAINT "User_charityId_fkey" FOREIGN KEY ("charityId") REFERENCES "Charity" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("charityId", "email", "id", "name", "password", "subscriptionPlan", "subscriptionStatus") SELECT "charityId", "email", "id", "name", "password", "subscriptionPlan", "subscriptionStatus" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
