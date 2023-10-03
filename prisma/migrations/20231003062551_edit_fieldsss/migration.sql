/*
  Warnings:

  - You are about to drop the `_PlaylistToVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_VideoTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_PlaylistToVideo";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_VideoTags";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_VideoToTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_VideoToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_VideoToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Video" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_VideoToPlaylist" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_VideoToPlaylist_A_fkey" FOREIGN KEY ("A") REFERENCES "Playlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_VideoToPlaylist_B_fkey" FOREIGN KEY ("B") REFERENCES "Video" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_VideoToTags_AB_unique" ON "_VideoToTags"("A", "B");

-- CreateIndex
CREATE INDEX "_VideoToTags_B_index" ON "_VideoToTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_VideoToPlaylist_AB_unique" ON "_VideoToPlaylist"("A", "B");

-- CreateIndex
CREATE INDEX "_VideoToPlaylist_B_index" ON "_VideoToPlaylist"("B");
