/*
  Warnings:

  - A unique constraint covering the columns `[chatId,userId]` on the table `chat_app_chat_users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[messageId,userId]` on the table `chat_app_message_readers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postId,userId]` on the table `post_app_postheart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postId,userId]` on the table `post_app_postlike` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postId,userId]` on the table `post_app_postview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `profile_app_profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[from_user_id,to_user_id]` on the table `user_app_friendship` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `compressed_image` to the `post_app_postimage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `original_image` to the `post_app_postimage` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_post_app_postimage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER NOT NULL,
    "original_image" TEXT NOT NULL,
    "compressed_image" TEXT NOT NULL,
    CONSTRAINT "post_app_postimage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_post_app_postimage" ("id", "postId") SELECT "id", "postId" FROM "post_app_postimage";
DROP TABLE "post_app_postimage";
ALTER TABLE "new_post_app_postimage" RENAME TO "post_app_postimage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "chat_app_chat_users_chatId_userId_key" ON "chat_app_chat_users"("chatId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "chat_app_message_readers_messageId_userId_key" ON "chat_app_message_readers"("messageId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "post_app_postheart_postId_userId_key" ON "post_app_postheart"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "post_app_postlike_postId_userId_key" ON "post_app_postlike"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "post_app_postview_postId_userId_key" ON "post_app_postview"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_app_profile_userId_key" ON "profile_app_profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_app_friendship_from_user_id_to_user_id_key" ON "user_app_friendship"("from_user_id", "to_user_id");
