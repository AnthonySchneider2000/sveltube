<script lang="ts">
  // @hmr:keep-all
  import type { Video, Playlist } from '$types/types'
  import { onMount } from 'svelte'
  let videos: Video[] = []
  let selectedPlaylist: string = ''
  let playlists: Playlist[] = []
  async function fetchPlaylists() {
    const res = await fetch('/api/fetchPlaylists')
    const playlists: Playlist[] = await res.json()
    return playlists
  }

  async function fetchVideos(playListId: string) {
    const res = await fetch(`/api/fetchVideos?playlistId=${playListId}`)
    const videos: Video[] = await res.json()
    console.log("videos",videos)
    return videos
  }

  function selectPlaylist(playlistId: string) {
    selectedPlaylist = playlistId
    fetchVideos(playlistId)
  }

  async function updateDatabase() {
    console.log('updating database')
    const res = await fetch('/api/youtubeApi')
  }

  onMount(async () => {
    playlists = await fetchPlaylists()
  })
</script>

<svelte:head>
  <title>Sveltube</title>
  <meta name="description" content="Sveltube" />
</svelte:head>
<h1 class="text-4xl text-center my-4">Sveltube</h1>

<!-- render a button that calls updateDatabase -->
<div class="flex justify-center">
  <button
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    on:click={updateDatabase}>
    Update Database
  </button>

</div>

<!-- render a div for each playlist, on click calls selectPlaylist -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ms-32 my-4">
  {#each playlists as playlist}
    <button
      class="hover:scale-125 hover:shadow-xl hover:bg-gray-400 p-4 transition
      w-[85%] duration-150 ease-in-out truncate text-center rounded-md"
      on:click={() => selectPlaylist(playlist.playlistId)}
      on:keydown={(e) => {
        if (e.key === 'Enter') {
          selectPlaylist(playlist.playlistId)
        }
      }}>
      {playlist.title}
    </button>
  {/each}
</div>

<!-- Render a div for each video in the videos array -->
{#if videos.length > 0}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ms-32 my-4">
    {#each videos as video}
      <a
        href={`https://www.youtube.com/watch?v=${video.id}`}
        target="_blank"
        class="hover:scale-125 hover:shadow-xl hover:bg-gray-400 p-4 transition
        w-[85%] duration-150 ease-in-out truncate text-center rounded-md">
        {video.title}
      </a>
    {/each}

  </div>
{:else}
  <p class="text-center">No videos to display</p>
{/if}
```
