export type YouTubeResource = { type: 'video' | 'channel'; id: string };

export function parseYouTubeLink(link: string): YouTubeResource | null {
  if (!link) return null;
  // Patterns for standard YouTube URLs
  const videoMatch =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/.exec(link);
  if (videoMatch) {
    return { type: 'video', id: videoMatch[1] };
  }
  const channelMatch =
    /(?:youtube\.com\/(?:c\/|channel\/|@))([\w-]+)/.exec(link);
  if (channelMatch) {
    return { type: 'channel', id: channelMatch[1] };
  }
  return null;
}

export interface ThumbnailResult {
  linkAnalyzed: string;
  thumbnails: string[];
}

import fetch from 'node-fetch';

export async function fetchLatestThumbnails(
  link: string,
  apiKey: string,
  maxResults = 5
): Promise<ThumbnailResult> {
  const parsed = parseYouTubeLink(link);
  if (!parsed) throw new Error('Invalid YouTube link');
  if (!apiKey) throw new Error('Missing YouTube API key');

  let urls: string[] = [];

  if (parsed.type === 'video') {
    const apiUrl =
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${parsed.id}&key=${apiKey}`;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data: any = await res.json();
    urls = data.items.map(
      (item: any) =>
        item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url
    );
  } else {
    // fetch latest videos from the channel
    const apiUrl =
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${parsed.id}&maxResults=${maxResults}&order=date&type=video&key=${apiKey}`;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data: any = await res.json();
    urls = data.items.map(
      (item: any) =>
        item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url
    );
  }

  return { linkAnalyzed: link, thumbnails: urls };
}
