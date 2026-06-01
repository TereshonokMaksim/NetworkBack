/*
  Warnings:

  - You are about to drop the `post_app_posttag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "post_app_posttag";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "post_app_post_tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "post_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    CONSTRAINT "post_app_post_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post_app_post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "post_app_post_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "post_app_tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "post_app_post_tags_post_id_tag_id_key" ON "post_app_post_tags"("post_id", "tag_id");
