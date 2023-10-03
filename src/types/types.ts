//types.ts
export interface Video {
  id: string;
  title: string;
  description: string;
  channel: string;
  videoId: string;
  playlistIds: string[];
  tags: Tag[];
}

export interface Playlist {
  id: string;
  playlistId: string;
  title: string;
  videos: Video[];
  parent: Playlist | null;
  parentId: number | null;
  children: Playlist[];
}

export interface Tag {
  id: string;
  tag: string;
  videoIds: string[];
}
