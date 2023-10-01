/*
  Warnings:

  - A unique constraint covering the columns `[playlistId]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[videoId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Playlist_playlistId_key" ON "Playlist"("playlistId");

-- CreateIndex
CREATE UNIQUE INDEX "Video_videoId_key" ON "Video"("videoId");
