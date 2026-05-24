/*
  Warnings:

  - You are about to drop the `UserRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserRelation";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserSocial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstUserId" INTEGER NOT NULL,
    "secondUserId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "UserSocial_firstUserId_fkey" FOREIGN KEY ("firstUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserSocial_secondUserId_fkey" FOREIGN KEY ("secondUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSocial_firstUserId_secondUserId_key" ON "UserSocial"("firstUserId", "secondUserId");
