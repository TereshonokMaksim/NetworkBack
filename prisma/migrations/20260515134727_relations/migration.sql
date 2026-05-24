-- CreateTable
CREATE TABLE "Relation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstUserId" INTEGER NOT NULL,
    "secondUserId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Relation_firstUserId_fkey" FOREIGN KEY ("firstUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Relation_secondUserId_fkey" FOREIGN KEY ("secondUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Relation_firstUserId_secondUserId_key" ON "Relation"("firstUserId", "secondUserId");
