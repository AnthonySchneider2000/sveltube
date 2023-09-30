<script lang="ts">
  import { PUBLIC_API_KEY } from '$env/static/public'
  const YT_API_URL =
    'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLt1aiQigbF8GpwHfHDaDwFWrXq-sf5Kwk&maxResults=50&key=' +
    PUBLIC_API_KEY
  let videos: any[] = []

  // fetch until there is no next page token
  async function fetchVideos(url: string) {
    const res = await fetch(url)
    const data = await res.json()
    videos = videos.concat(data.items)
    if (data.nextPageToken) {
      await fetchVideos(url + '&pageToken=' + data.nextPageToken)
    }
  }

  fetchVideos(YT_API_URL)
</script>

<svelte:head>
  <title>Sveltube</title>
  <meta name="description" content="Sveltube" />
</svelte:head>

<!-- Render a div for each video in the videos array -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ms-32 my-4">
  {#each videos as video}
    <div
      class="hover:scale-125 hover:shadow-xl hover:bg-gray-400 p-4 transition
      duration-150 ease-in-out truncate text-center rounded-md">
      {video.snippet.title}
    </div>
  {/each}

</div>
