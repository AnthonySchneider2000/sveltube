// fetchVideos.ts

import { PrismaClient} from "@prisma/client";
import type { Tag as PrismaTab, Video as PrismaVideo } from "@prisma/client";
import type { Playlist, Video, Tag } from "$src/types/types";
import { json } from "@sveltejs/kit";

// fetch all videos from a playlist

const prismaClient = new PrismaClient();

export async function GET({ url }){
  const playlistId = url.searchParams.get("playlistId");
  console.log("fetching videos from playlist ");
  console.log(playlistId);
  let allVideos: any[] = [];
  let videos: Video[] = [];
  allVideos = await prismaClient.video.findMany({
    include: {
      playlists: true,
      tags: true,
    },
  });
  for (const video of allVideos) {
    console.log(video);
    let playlistIds: string[] = [];
    let tags: Tag[] = [];
    for (const tag of video.tags) {
      // for each tag the video has
      tags.push({
        // add the tag to the array
        id: tag.tagId,
        tag: tag.tag,
        //map to the videos videoid
        videoIds: video.videoId,
      });
    }
    for (const playlist of video.playlists) {
      // for each playlist the video is in
      playlistIds.push(playlist.playlistId); // add the playlistId to the array
      if (playlist.playlistId === playlistId) {
        // if the playlist is the one we're looking for
        videos.push({
          // add the video to the array
          id: video.videoId,
          title: video.title,
          description: video.description,
          channel: video.channel,
          videoId: video.videoId,
          playlistIds: playlistIds,
          tags: tags,
        });
      }
    }
  }
  console.log(videos.length + " videos found.");
  await prismaClient.$disconnect();
  return json(videos);
};
