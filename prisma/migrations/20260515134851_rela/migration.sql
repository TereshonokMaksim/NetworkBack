/*
  Warnings:

  - You are about to drop the `Relation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Relation";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstUserId" INTEGER NOT NULL,
    "secondUserId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "UserRelation_firstUserId_fkey" FOREIGN KEY ("firstUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserRelation_secondUserId_fkey" FOREIGN KEY ("secondUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRelation_firstUserId_secondUserId_key" ON "UserRelation"("firstUserId", "secondUserId");
