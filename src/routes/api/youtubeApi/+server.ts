// src/routes/api/youtubeApi.ts
import { PrismaClient } from "@prisma/client";
import { YT_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";

const prismaClient = new PrismaClient();
async function getVideos(urlPage: string, playlistId: string) {
  console.log("fetching videos from playlist " + playlistId);
  let videos: any[] = [];
  const url =
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=` +
    playlistId +
    `&maxResults=50&key=` +
    YT_API_KEY +
    `&pageToken=` +
    urlPage;
  console.log("getVideos", url);
  const res = await fetch(url);
  const data = await res.json();
  videos = data.items;
  if (data.nextPageToken) {
    videos = videos.concat(await getVideos(data.nextPageToken, playlistId));
  }
  return videos;
}

async function getPlaylists(urlPage: string) {
  let playlists: any[] = [];
  console.log("fetching playlists");
  const channelId = "UC3pqkREPYHTGan3DrGy363Q";
  const url =
    `https://www.googleapis.com/youtube/v3/playlists?part=snippet&maxResults=50` +
    `&key=` +
    YT_API_KEY +
    `&pageToken=` +
    urlPage +
    `&channelId=` +
    channelId;

  const res = await fetch(url);
  const data = await res.json();
  playlists = data.items;
  console.log("next page token: ", data.nextPageToken);
  if (data.nextPageToken) {
    playlists = playlists.concat(await getPlaylists(data.nextPageToken));
  }
  return playlists;
}

export async function GET(userId: string) {
  // fetch all playlists from youtube
  let playlists: any[] = [];
  playlists = await getPlaylists("");

  console.log(playlists.length + " playlists found.");

  let response: string = "";

  // check if playlist exists in db
  for (const playlist of playlists) {
    const playlistId = playlist.id;
    const title = playlist.snippet.title;
    const playlistExists = await prismaClient.playlist.count({
      where: {
        playlistId: playlistId,
      },
    });
    if (playlistExists === 0) {
      // if the playlist doesn't exist, add it to the db
      await prismaClient.playlist.create({
        data: {
          playlistId: playlistId,
          title: title,
        },
      });
      response += "Playlist " + title + " added to the database.\n";
    }

    const videos = await getVideos("", playlistId);

    console.log(videos.length + " videos found.");
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
            playlists: {
              connect: {
                playlistId: playlistId,
              },
            },
          },
        });
        response += "    Video " + videoTitle + " added to the database.";
      } else {
        //if the video exists, check if it's already in the playlist
        const playlistExists = videoInstance.playlists.find(
          (playlist) => playlist.playlistId === playlistId
        );

        if (playlistExists !== undefined) {
          response +=
            "    Video " + videoTitle + " already exists in the playlist.";
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
          response += "    Video " + videoTitle + " added to the playlist.";
        }
      } // end of else: videoInstance === null
    } // end of for loop: videos
  } // end of for loop: playlists

  await prismaClient.$disconnect(); // disconnect from the db
  console.log(response);
  // return a json response
  return json(response);
}
