/*
  Warnings:

  - You are about to drop the column `adminId` on the `chat_app_chat` table. All the data in the column will be lost.
  - You are about to drop the column `chatId` on the `chat_app_chat_users` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `chat_app_chat_users` table. All the data in the column will be lost.
  - You are about to drop the column `messageId` on the `chat_app_message_readers` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `chat_app_message_readers` table. All the data in the column will be lost.
  - You are about to drop the column `messageId` on the `chat_app_messageimage` table. All the data in the column will be lost.
  - You are about to drop the column `chatId` on the `chat_app_messages` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `chat_app_messages` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `post_app_post` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `post_app_postheart` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `post_app_postheart` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `post_app_postimage` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `post_app_postlike` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `post_app_postlike` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `post_app_postlink` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `post_app_posttag` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `post_app_posttag` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `post_app_postview` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `post_app_postview` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `profile_app_album` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `profile_app_album` table. All the data in the column will be lost.
  - You are about to drop the column `albumId` on the `profile_app_albumimage` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `profile_app_profile` table. All the data in the column will be lost.
  - Added the required column `chat_id` to the `chat_app_chat_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `chat_app_chat_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message_id` to the `chat_app_message_readers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `chat_app_message_readers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message_id` to the `chat_app_messageimage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chat_id` to the `chat_app_messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `chat_app_messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `post_app_post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `post_app_postheart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `post_app_postheart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `post_app_postimage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `post_app_postlike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `post_app_postlike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `post_app_postlink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `post_app_posttag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag_id` to the `post_app_posttag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `post_app_postview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `post_app_postview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `profile_app_album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `album_id` to the `profile_app_albumimage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `profile_app_profile` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_chat_app_chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "is_group" BOOLEAN NOT NULL,
    "avatar" TEXT,
    "admin_id" INTEGER,
    CONSTRAINT "chat_app_chat_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "user_app_user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_chat_app_chat" ("avatar", "id", "is_group", "name") SELECT "avatar", "id", "is_group", "name" FROM "chat_app_chat";
DROP TABLE "chat_app_chat";
ALTER TABLE "new_chat_app_chat" RENAME TO "chat_app_chat";
CREATE TABLE "new_chat_app_chat_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "chat_id" INTEGER NOT NULL,
    CONSTRAINT "chat_app_chat_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "chat_app_chat_users_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chat_app_chat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_chat_app_chat_users" ("id") SELECT "id" FROM "chat_app_chat_users";
DROP TABLE "chat_app_chat_users";
ALTER TABLE "new_chat_app_chat_users" RENAME TO "chat_app_chat_users";
CREATE UNIQUE INDEX "chat_app_chat_users_chat_id_user_id_key" ON "chat_app_chat_users"("chat_id", "user_id");
CREATE TABLE "new_chat_app_message_readers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "chat_app_message_readers_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "chat_app_messages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "chat_app_message_readers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_chat_app_message_readers" ("id") SELECT "id" FROM "chat_app_message_readers";
DROP TABLE "chat_app_message_readers";
ALTER TABLE "new_chat_app_message_readers" RENAME TO "chat_app_message_readers";
CREATE UNIQUE INDEX "chat_app_message_readers_message_id_user_id_key" ON "chat_app_message_readers"("message_id", "user_id");
CREATE TABLE "new_chat_app_messageimage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "image" TEXT NOT NULL,
    "message_id" INTEGER NOT NULL,
    CONSTRAINT "chat_app_messageimage_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "chat_app_messages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_chat_app_messageimage" ("id", "image") SELECT "id", "image" FROM "chat_app_messageimage";
DROP TABLE "chat_app_messageimage";
ALTER TABLE "new_chat_app_messageimage" RENAME TO "chat_app_messageimage";
CREATE TABLE "new_chat_app_messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sender_id" INTEGER NOT NULL,
    CONSTRAINT "chat_app_messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chat_app_chat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "chat_app_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_chat_app_messages" ("created_at", "id", "text") SELECT "created_at", "id", "text" FROM "chat_app_messages";
DROP TABLE "chat_app_messages";
ALTER TABLE "new_chat_app_messages" RENAME TO "chat_app_messages";
CREATE TABLE "new_post_app_post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "post_app_post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_post_app_post" ("content", "created_at", "id", "title", "topic", "updated_at") SELECT "content", "created_at", "id", "title", "topic", "updated_at" FROM "post_app_post";
DROP TABLE "post_app_post";
ALTER TABLE "new_post_app_post" RENAME TO "post_app_post";
CREATE TABLE "new_post_app_postheart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    CONSTRAINT "post_app_postheart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "post_app_postheart_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post_app_post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_post_app_postheart" ("id") SELECT "id" FROM "post_app_postheart";
DROP TABLE "post_app_postheart";
ALTER TABLE "new_post_app_postheart" RENAME TO "post_app_postheart";
CREATE UNIQUE INDEX "post_app_postheart_post_id_user_id_key" ON "post_app_postheart"("post_id", "user_id");
CREATE TABLE "new_post_app_postimage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "post_id" INTEGER NOT NULL,
    "original_image" TEXT NOT NULL,
    "compressed_image" TEXT NOT NULL,
    CONSTRAINT "post_app_postimage_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post_app_post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_post_app_postimage" ("compressed_image", "id", "original_image") SELECT "compressed_image", "id", "original_image" FROM "post_app_postimage";
DROP TABLE "post_app_postimage";
ALTER TABLE "new_post_app_postimage" RENAME TO "post_app_postimage";
CREATE TABLE "new_post_app_postlike" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    CONSTRAINT "post_app_postlike_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "post_app_postlike_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post_app_post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_post_app_postlike" ("id") SELECT "id" FROM "post_app_postlike";
DROP TABLE "post_app_postlike";
ALTER TABLE "new_post_app_postlike" RENAME TO "post_app_postlike";
CREATE UNIQUE INDEX "post_app_postlike_post_id_user_id_key" ON "post_app_postlike"("post_id", "user_id");
CREATE TABLE "new_post_app_postlink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "link" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,
    CONSTRAINT "post_app_postlink_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post_app_post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_post_app_postlink" ("id", "link") SELECT "id", "link" FROM "post_app_postlink";
DROP TABLE "post_app_postlink";
ALTER TABLE "new_post_app_postlink" RENAME TO "post_app_postlink";
CREATE TABLE "new_post_app_posttag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "post_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    CONSTRAINT "post_app_posttag_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post_app_post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "post_app_posttag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "post_app_tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_post_app_posttag" ("id") SELECT "id" FROM "post_app_posttag";
DROP TABLE "post_app_posttag";
ALTER TABLE "new_post_app_posttag" RENAME TO "post_app_posttag";
CREATE UNIQUE INDEX "post_app_posttag_post_id_tag_id_key" ON "post_app_posttag"("post_id", "tag_id");
CREATE TABLE "new_post_app_postview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    CONSTRAINT "post_app_postview_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "post_app_postview_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post_app_post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_post_app_postview" ("id") SELECT "id" FROM "post_app_postview";
DROP TABLE "post_app_postview";
ALTER TABLE "new_post_app_postview" RENAME TO "post_app_postview";
CREATE UNIQUE INDEX "post_app_postview_post_id_user_id_key" ON "post_app_postview"("post_id", "user_id");
CREATE TABLE "new_profile_app_album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "is_shown" BOOLEAN NOT NULL DEFAULT true,
    "theme" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "year" INTEGER NOT NULL,
    CONSTRAINT "profile_app_album_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile_app_profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_profile_app_album" ("id", "is_shown", "name", "theme", "year") SELECT "id", "is_shown", "name", "theme", "year" FROM "profile_app_album";
DROP TABLE "profile_app_album";
ALTER TABLE "new_profile_app_album" RENAME TO "profile_app_album";
CREATE TABLE "new_profile_app_albumimage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "image" TEXT NOT NULL,
    "is_shown" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "album_id" INTEGER NOT NULL,
    CONSTRAINT "profile_app_albumimage_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "profile_app_album" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_profile_app_albumimage" ("created_at", "id", "image", "is_shown") SELECT "created_at", "id", "image", "is_shown" FROM "profile_app_albumimage";
DROP TABLE "profile_app_albumimage";
ALTER TABLE "new_profile_app_albumimage" RENAME TO "profile_app_albumimage";
CREATE TABLE "new_profile_app_profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "pseudonym" TEXT,
    "birth_date" TEXT,
    "signature" TEXT,
    "is_image_signature" BOOLEAN NOT NULL DEFAULT false,
    "is_text_signature" BOOLEAN NOT NULL DEFAULT false,
    "avatar" TEXT,
    CONSTRAINT "profile_app_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_profile_app_profile" ("avatar", "birth_date", "id", "is_image_signature", "is_text_signature", "pseudonym", "signature") SELECT "avatar", "birth_date", "id", "is_image_signature", "is_text_signature", "pseudonym", "signature" FROM "profile_app_profile";
DROP TABLE "profile_app_profile";
ALTER TABLE "new_profile_app_profile" RENAME TO "profile_app_profile";
CREATE UNIQUE INDEX "profile_app_profile_user_id_key" ON "profile_app_profile"("user_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
