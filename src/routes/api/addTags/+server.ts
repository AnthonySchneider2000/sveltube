// api/addTags.ts

import { PrismaClient } from "@prisma/client";
import type { Tag, Video, Playlist } from "$src/types/types";
import { json } from "@sveltejs/kit";

const prismaClient = new PrismaClient();

// goes through every video in the database and initializes all tags to have names equal to the playlist names for that video
export async function GET(){


    
    let videoData: any[] = [];

    videoData = await prismaClient.video.findMany({
        include: {
        playlists: true,
        },
    });

    for(const video of videoData){
        let tags: Tag[] = [];
        for(const playlist of video.playlists){

                console.log("adding tag " + playlist.title + " to database, to video " + video.title);
                tags.push({
                    id: playlist.playlistId,
                    tag: playlist.title,
                    videoIds: video.videoId,
                });

        }
        for(const tag of tags){
            await prismaClient.tag.create({
                data: {
                    tag: tag.tag,
                    videos: {
                        connect: {
                            videoId: video.videoId,
                        },
                    },
                },
            });
            
        }
    }

    await prismaClient.$disconnect();
    
    const response = "Tags added to database.";
    return json(response);
    
}