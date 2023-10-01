// fetchPlaylists.ts

import { PrismaClient } from "@prisma/client";
import type { Playlist } from "$src/types/types";
import { json } from "@sveltejs/kit";

// fetch all playlists from db

const prismaClient = new PrismaClient();

export async function GET(){
  let data: any[] = [];
  let playlists: Playlist[] = [];

  data = await prismaClient.playlist.findMany();
  playlists = data.map((playlist) => {
    return {
      id: playlist.id,
      playlistId: playlist.playlistId,
      title: playlist.title,
      videos: [],
      parent: null,
      parentId: null,
      children: [],
    };
  });

  prismaClient.$disconnect();

  return json(playlists);
};
