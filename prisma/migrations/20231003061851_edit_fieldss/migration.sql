/*
  Warnings:

  - You are about to drop the `_TagToVideo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_TagToVideo";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_VideoTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_VideoTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_VideoTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Video" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_VideoTags_AB_unique" ON "_VideoTags"("A", "B");

-- CreateIndex
CREATE INDEX "_VideoTags_B_index" ON "_VideoTags"("B");
