/*
  Warnings:

  - You are about to drop the column `shown` on the `profile_app_album` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_profile_app_album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL,
    "is_shown" BOOLEAN NOT NULL DEFAULT true,
    "theme" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "year" INTEGER NOT NULL,
    CONSTRAINT "profile_app_album_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile_app_profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_profile_app_album" ("createdAt", "id", "name", "profileId", "theme", "year") SELECT "createdAt", "id", "name", "profileId", "theme", "year" FROM "profile_app_album";
DROP TABLE "profile_app_album";
ALTER TABLE "new_profile_app_album" RENAME TO "profile_app_album";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
