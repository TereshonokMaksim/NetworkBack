-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AlbumImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imageId" INTEGER NOT NULL,
    "albumId" INTEGER NOT NULL,
    "shown" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "AlbumImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AlbumImage_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AlbumImage" ("albumId", "id", "imageId") SELECT "albumId", "id", "imageId" FROM "AlbumImage";
DROP TABLE "AlbumImage";
ALTER TABLE "new_AlbumImage" RENAME TO "AlbumImage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
