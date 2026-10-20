import { describe, expect, it, vi } from 'vitest';
import { fetchYouTubeVideos } from './sync-videos';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

describe('fetchYouTubeVideos', () => {
  it('paginates uploads, batches metadata, filters Shorts and livestreams, and sorts videos', async () => {
    const fetcher = vi.fn(async (input: string | URL | Request) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith('/channels'))
        return jsonResponse({
          items: [
            { contentDetails: { relatedPlaylists: { uploads: 'uploads' } } },
          ],
        });
      if (url.pathname.endsWith('/playlistItems')) {
        if (!url.searchParams.has('pageToken'))
          return jsonResponse({
            items: [{ contentDetails: { videoId: 'one' } }],
            nextPageToken: 'next',
          });
        return jsonResponse({
          items: [
            { contentDetails: { videoId: 'short' } },
            { contentDetails: { videoId: 'live' } },
            { contentDetails: { videoId: 'two' } },
          ],
        });
      }
      return jsonResponse({
        items: [
          videoResource('one', 'Mesmo título', '2026-01-01T12:00:00Z', 'PT5M'),
          videoResource('short', 'Short', '2026-04-01T12:00:00Z', 'PT3M'),
          {
            ...videoResource(
              'live',
              'Transmissão',
              '2026-03-01T12:00:00Z',
              'PT1H',
            ),
            liveStreamingDetails: { actualStartTime: '2026-03-01T12:00:00Z' },
          },
          videoResource(
            'two',
            'Mesmo título',
            '2026-02-01T12:00:00Z',
            'PT1H2M3S',
          ),
        ],
      });
    });

    const result = await fetchYouTubeVideos('key', fetcher as typeof fetch);

    expect(
      result.map(({ id, slug, durationSeconds }) => ({
        id,
        slug,
        durationSeconds,
      })),
    ).toEqual([
      { id: 'two', slug: 'mesmo-titulo', durationSeconds: 3723 },
      {
        id: 'one',
        slug: 'mesmo-titulo-2026-01-01',
        durationSeconds: 300,
      },
    ]);
    expect(fetcher).toHaveBeenCalledTimes(4);
  });

  it('rejects missing credentials and malformed channel responses', async () => {
    await expect(fetchYouTubeVideos('')).rejects.toThrow(
      'YOUTUBE_DATA_API is required',
    );
    await expect(
      fetchYouTubeVideos(
        'key',
        vi.fn(async () => jsonResponse({ items: [] })) as typeof fetch,
      ),
    ).rejects.toThrow('uploads playlist');
  });
});

function videoResource(
  id: string,
  title: string,
  publishedAt: string,
  duration: string,
) {
  return {
    id,
    snippet: {
      title,
      description: 'Primeiro parágrafo\n\nhttps://gamefoss.com.br.',
      publishedAt,
      liveBroadcastContent: 'none',
      thumbnails: { high: { url: `https://img.test/${id}.jpg` } },
    },
    contentDetails: { duration },
    status: { privacyStatus: 'public' },
  };
}
