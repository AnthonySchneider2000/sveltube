// src/routes/api/youtubeApi.ts
import { PrismaClient } from "@prisma/client";
import { YT_API_KEY } from "$env/static/private";
import type { Playlist, Video } from "$src/types/types";

const prismaClient = new PrismaClient();

const getPlaylistData = async (playlistId: string) => {
  const url =
    `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=` +
    playlistId +
    `&key=` +
    YT_API_KEY;
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export const getPlaylistList = async (userId: string) => {
  const channelId = "UC3pqkREPYHTGan3DrGy363Q";
  const url =
    `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=` +
    channelId +
    `&key=` +
    YT_API_KEY;

  const res = await fetch(url);
  const data = await res.json();
  const playlists = data.items;

  let response: string[] = [];

  // check if playlist exists in db
  for (const playlist of playlists) {
    const playlistId = playlist.id;
    const title = playlist.snippet.title;
    const playlistExists = await prismaClient.playlist.count({
      where: {
        playlistId: playlistId,
      },
    });
    if (playlistExists !== 0) {
      response.push("Playlist " + title + " already exists in the database.");
      continue; // if the playlist exists, skip it
    }
    // if the playlist doesn't exist, add it to the db
    await prismaClient.playlist.create({
      data: {
        playlistId: playlistId,
        title: title,
      },
    });
    response.push("Playlist " + title + " added to the database.");

    const playlistData = await getPlaylistData(playlistId);
    const videos = playlistData.items;

    for (const video of videos) {
      const videoId = video.snippet.resourceId.videoId;
      const videoTitle = video.snippet.title;

      let videoInstance = await prismaClient.video.findUnique({
        where: {
          videoId: videoId,
        },
        include: {
          playlists: true,
        },
      });

      if (videoInstance === null) {
        // if the video doesn't exist, add it to the db
        const videoDescription = video.snippet.description;
        const videoChannel = video.snippet.channelTitle;
        await prismaClient.video.create({
          data: {
            videoId: videoId,
            title: videoTitle,
            description: videoDescription,
            channel: videoChannel,
          },
        });
        response.push("    Video " + videoTitle + " added to the database.");
      } else {
        //if the video exists, check if it's already in the playlist
        const playlistExists = videoInstance.playlists.find(
          (playlist) => playlist.playlistId === playlistId
        );

        if (playlistExists !== undefined) {
          response.push(
            "    Video " + videoTitle + " already exists in the playlist."
          );
          continue; // if the video is already in the playlist, skip it
        } else {
          // if the video is not in the playlist, add it to the playlist
          await prismaClient.playlist.update({
            where: {
              playlistId: playlistId,
            },
            data: {
              videos: {
                connect: {
                  videoId: videoId,
                },
              },
            },
          });
          // update the video with the new playlist
          await prismaClient.video.update({
            where: {
              videoId: videoId,
            },
            data: {
              playlists: {
                connect: {
                  playlistId: playlistId,
                },
              },
            },
          });
          response.push("    Video " + videoTitle + " added to the playlist.");
        }
      } // end of else: videoInstance === null
    } // end of for loop: videos
  } // end of for loop: playlists

  await prismaClient.$disconnect(); // disconnect from the db

  // return a json response
  return {
    body: {
      message: response,
    },
  };
};
