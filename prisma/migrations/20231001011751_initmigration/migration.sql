-- CreateTable
CREATE TABLE "Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "videoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "channel" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playlistId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "parentId" INTEGER,
    CONSTRAINT "Playlist_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Playlist" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PlaylistToVideo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PlaylistToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "Playlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PlaylistToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "Video" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_PlaylistToVideo_AB_unique" ON "_PlaylistToVideo"("A", "B");

-- CreateIndex
CREATE INDEX "_PlaylistToVideo_B_index" ON "_PlaylistToVideo"("B");
