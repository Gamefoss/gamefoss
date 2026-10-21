import { access, mkdir, writeFile } from 'node:fs/promises';
import { loadEnvFile } from 'node:process';
import {
  formatYouTubeDescription,
  normalizeVideoDescription,
  parseYouTubeDuration,
  type YouTubeVideo,
} from '@/lib/videos';
import { SITE_SOCIALS, slugify } from '@/lib/site';
import { VIDEO_RULES, type VideoRules } from '../config/videos';

const YOUTUBE_API_ROOT = 'https://www.googleapis.com/youtube/v3';
export const YOUTUBE_CHANNEL_ID = new URL(SITE_SOCIALS.youtube).pathname
  .split('/')
  .filter(Boolean)
  .at(-1)!;

interface YouTubeListResponse<T> {
  items?: T[];
  nextPageToken?: string;
  error?: { message?: string };
}

interface ChannelResource {
  contentDetails?: { relatedPlaylists?: { uploads?: string } };
}

interface PlaylistItemResource {
  contentDetails?: { videoId?: string };
}

interface VideoResource {
  id?: string;
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    liveBroadcastContent?: string;
    thumbnails?: Record<string, { url?: string }>;
  };
  contentDetails?: { duration?: string };
  liveStreamingDetails?: Record<string, unknown>;
  status?: { privacyStatus?: string };
}

async function youtubeRequest<T>(
  path: string,
  params: Record<string, string>,
  apiKey: string,
  fetcher: typeof fetch,
) {
  const url = new URL(`${YOUTUBE_API_ROOT}/${path}`);
  Object.entries({ ...params, key: apiKey }).forEach(([key, value]) =>
    url.searchParams.set(key, value),
  );
  const response = await fetcher(url, {
    headers: { 'user-agent': 'Gamefoss-site-builder/1.0' },
    signal: AbortSignal.timeout(30_000),
  });
  const body = (await response.json()) as YouTubeListResponse<T>;
  if (!response.ok)
    throw new Error(
      `YouTube Data API request failed (${response.status}): ${body.error?.message || path}`,
    );
  if (!Array.isArray(body.items))
    throw new Error(`Invalid YouTube Data API response for ${path}`);
  return body;
}

export async function fetchYouTubeVideos(
  apiKey: string,
  fetcher: typeof fetch = fetch,
  rules: VideoRules = VIDEO_RULES,
): Promise<YouTubeVideo[]> {
  if (!apiKey) throw new Error('YOUTUBE_DATA_API is required');

  const channels = await youtubeRequest<ChannelResource>(
    'channels',
    { part: 'contentDetails', id: YOUTUBE_CHANNEL_ID },
    apiKey,
    fetcher,
  );
  const uploadsPlaylist =
    channels.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylist)
    throw new Error('YouTube channel did not contain an uploads playlist');

  const videoIds: string[] = [];
  let pageToken: string | undefined;
  do {
    const playlist = await youtubeRequest<PlaylistItemResource>(
      'playlistItems',
      {
        part: 'contentDetails',
        playlistId: uploadsPlaylist,
        maxResults: '50',
        ...(pageToken && { pageToken }),
      },
      apiKey,
      fetcher,
    );
    for (const item of playlist.items || []) {
      const videoId = item.contentDetails?.videoId;
      if (videoId) videoIds.push(videoId);
    }
    pageToken = playlist.nextPageToken;
  } while (pageToken);

  const resources: VideoResource[] = [];
  for (let index = 0; index < videoIds.length; index += 50) {
    const videos = await youtubeRequest<VideoResource>(
      'videos',
      {
        part: 'snippet,contentDetails,liveStreamingDetails,status',
        id: videoIds.slice(index, index + 50).join(','),
        maxResults: '50',
      },
      apiKey,
      fetcher,
    );
    resources.push(...(videos.items || []));
  }

  const excludedVideoIds = new Set(rules.excludedVideoIds);
  const candidates = resources.flatMap((video) => {
    const id = video.id;
    const title = video.snippet?.title?.trim();
    const publishedAt = video.snippet?.publishedAt;
    const duration = video.contentDetails?.duration;
    const thumbnail =
      video.snippet?.thumbnails?.maxres?.url ||
      video.snippet?.thumbnails?.standard?.url ||
      video.snippet?.thumbnails?.high?.url ||
      video.snippet?.thumbnails?.medium?.url ||
      video.snippet?.thumbnails?.default?.url;
    if (
      !id ||
      !title ||
      !publishedAt ||
      !duration ||
      !thumbnail ||
      video.status?.privacyStatus !== 'public' ||
      video.liveStreamingDetails ||
      video.snippet?.liveBroadcastContent !== 'none'
    )
      return [];
    const durationSeconds = parseYouTubeDuration(duration);
    if (
      durationSeconds <= rules.excludeAtOrBelowDurationSeconds ||
      excludedVideoIds.has(id)
    )
      return [];
    const publishedDate = new Date(publishedAt);
    if (Number.isNaN(publishedDate.valueOf())) return [];
    const descriptionText = normalizeVideoDescription(
      video.snippet?.description || '',
    );
    return [
      {
        id,
        slug: slugify(title),
        title,
        description: formatYouTubeDescription(descriptionText),
        descriptionText,
        publishedAt: publishedDate.toISOString(),
        durationSeconds,
        thumbnail,
        youtubeUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`,
      } satisfies YouTubeVideo,
    ];
  });

  candidates.sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
  const seen = new Set<string>();
  return candidates.map((video) => {
    let slug = video.slug || video.id;
    if (seen.has(slug)) slug = `${slug}-${video.publishedAt.slice(0, 10)}`;
    let uniqueSlug = slug;
    let suffix = 2;
    while (seen.has(uniqueSlug)) uniqueSlug = `${slug}-${suffix++}`;
    seen.add(uniqueSlug);
    return { ...video, slug: uniqueSlug };
  });
}

async function loadLocalEnvironment() {
  try {
    await access('.env');
    loadEnvFile('.env');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
}

async function main() {
  await loadLocalEnvironment();
  const videos = await fetchYouTubeVideos(process.env.YOUTUBE_DATA_API || '');
  await mkdir('.cache', { recursive: true });
  await writeFile('.cache/videos.json', `${JSON.stringify(videos, null, 2)}\n`);
  console.log(`Synced ${videos.length} YouTube videos.`);
}

if (process.env.VITEST !== 'true')
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
