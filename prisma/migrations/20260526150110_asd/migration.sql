/*
  Warnings:

  - You are about to drop the `Album` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AlbumImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Avatar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPostStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSocial` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Album";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AlbumImage";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Avatar";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Image";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PostLink";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PostTag";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Tag";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserPostStatus";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserSocial";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "profile_app_album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL,
    "shown" BOOLEAN NOT NULL DEFAULT true,
    "theme" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "year" INTEGER NOT NULL,
    CONSTRAINT "profile_app_album_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile_app_profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "profile_app_albumimage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "image" TEXT NOT NULL,
    "is_shown" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "albumId" INTEGER NOT NULL,
    CONSTRAINT "profile_app_albumimage_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "profile_app_album" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chat_app_chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "is_group" BOOLEAN NOT NULL,
    "avatar" TEXT,
    "adminId" INTEGER,
    CONSTRAINT "chat_app_chat_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "user_app_user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chat_app_chat_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,
    CONSTRAINT "chat_app_chat_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "chat_app_chat_users_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chat_app_chat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_app_friendship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "from_user_id" INTEGER NOT NULL,
    "to_user_id" INTEGER NOT NULL,
    CONSTRAINT "user_app_friendship_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_app_friendship_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chat_app_messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "chatId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" INTEGER NOT NULL,
    CONSTRAINT "chat_app_messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chat_app_chat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "chat_app_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chat_app_messageimage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "image" TEXT NOT NULL,
    "messageId" INTEGER NOT NULL,
    CONSTRAINT "chat_app_messageimage_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "chat_app_messages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chat_app_message_readers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "messageId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "chat_app_message_readers_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "chat_app_messages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "chat_app_message_readers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "post_app_post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "post_app_post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "post_app_postheart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "post_app_postheart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "post_app_postheart_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "post_app_postimage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "post_app_postimage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "post_app_postlike" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "post_app_postlike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "post_app_postlike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "post_app_postlink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "link" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "post_app_postlink_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "post_app_posttag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    CONSTRAINT "post_app_posttag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "post_app_posttag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "post_app_tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "post_app_postview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "post_app_postview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "post_app_postview_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "profile_app_profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "pseudonym" TEXT,
    "birth_date" TEXT,
    "signature" TEXT,
    "is_image_signature" BOOLEAN NOT NULL DEFAULT false,
    "is_text_signature" BOOLEAN NOT NULL DEFAULT false,
    "avatar" TEXT,
    CONSTRAINT "profile_app_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "post_app_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "postId" INTEGER,
    CONSTRAINT "post_app_tag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_app_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "surname" TEXT,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "post_app_posttag_postId_tagId_key" ON "post_app_posttag"("postId", "tagId");
