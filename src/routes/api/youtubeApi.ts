// src/routes/api/youtubeApi.ts
import { PrismaClient } from "@prisma/client";
import { YT_API_KEY } from "$env/static/private";

const prismaClient = new PrismaClient();

// this file calls the youtube api and populates the database with the data

// this function takes in a youtube video id and returns the youtube video data

export const getPlaylistsData = async (videoId: string) => {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YT_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};