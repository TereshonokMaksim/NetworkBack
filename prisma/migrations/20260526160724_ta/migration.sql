/*
  Warnings:

  - You are about to drop the column `postId` on the `post_app_tag` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_post_app_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_post_app_tag" ("id", "name") SELECT "id", "name" FROM "post_app_tag";
DROP TABLE "post_app_tag";
ALTER TABLE "new_post_app_tag" RENAME TO "post_app_tag";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
