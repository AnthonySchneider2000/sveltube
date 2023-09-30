export interface Video {
    id: string
    title: string
    description: string
    channel: string
    videoId: string
    playlistIds: string[]
  }

export interface Playlist {
    id: string
    title: string
    videos: Video[]
    parent: Playlist | null
    parentId: number | null
    children: Playlist[]
  }
