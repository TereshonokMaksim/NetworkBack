-- CreateTable
CREATE TABLE "Avatar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "imageId" INTEGER NOT NULL,
    "currentUserUsingId" INTEGER,
    CONSTRAINT "Avatar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Avatar_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "originalImagePath" TEXT NOT NULL,
    "compressedImagePath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "User" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "User_currentAvatarId_fkey" FOREIGN KEY ("currentAvatarId") REFERENCES "Avatar" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_signatureImageId_fkey" FOREIGN KEY ("signatureImageId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_imageId_key" ON "Avatar"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "User_currentAvatarId_key" ON "User"("currentAvatarId");

-- CreateIndex
CREATE UNIQUE INDEX "User_signatureImageId_key" ON "User"("signatureImageId");
