/*
  Warnings:

  - Added the required column `postId` to the `PostLink` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PostLink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "link" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "PostLink_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PostLink" ("id", "link") SELECT "id", "link" FROM "PostLink";
DROP TABLE "PostLink";
ALTER TABLE "new_PostLink" RENAME TO "PostLink";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
