-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "surname" TEXT,
    "nickname" TEXT,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "currentAvatarId" INTEGER,
    "showNickname" BOOLEAN NOT NULL DEFAULT false,
    "signatureImageId" INTEGER,
    "showSignature" BOOLEAN NOT NULL DEFAULT false,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "User_currentAvatarId_fkey" FOREIGN KEY ("currentAvatarId") REFERENCES "Avatar" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_signatureImageId_fkey" FOREIGN KEY ("signatureImageId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "currentAvatarId", "email", "id", "isAdmin", "name", "nickname", "online", "password", "showNickname", "showSignature", "signatureImageId", "surname", "username") SELECT "createdAt", "currentAvatarId", "email", "id", "isAdmin", "name", "nickname", "online", "password", "showNickname", "showSignature", "signatureImageId", "surname", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_currentAvatarId_key" ON "User"("currentAvatarId");
CREATE UNIQUE INDEX "User_signatureImageId_key" ON "User"("signatureImageId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
