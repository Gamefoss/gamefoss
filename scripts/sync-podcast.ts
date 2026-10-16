import { XMLParser } from 'fast-xml-parser';
import { mkdir, writeFile } from 'node:fs/promises';
import { sanitizeEpisodeHtml, type PodcastEpisode } from '../src/lib/podcast';
import { PODCAST_FEED, slugify } from '../src/lib/site';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  cdataPropName: '__cdata',
  textNodeName: '__text',
  processEntities: true,
});
const text = (value: unknown): string => {
  if (typeof value === 'string' || typeof value === 'number')
    return String(value);
  if (value && typeof value === 'object')
    return String(
      (value as Record<string, unknown>).__cdata ??
        (value as Record<string, unknown>).__text ??
        '',
    );
  return '';
};
const attr = (value: unknown, key: string): string =>
  value && typeof value === 'object'
    ? String((value as Record<string, unknown>)[`@_${key}`] ?? '')
    : '';

export function parsePodcast(xml: string): PodcastEpisode[] {
  const parsed = parser.parse(xml);
  const channel = parsed?.rss?.channel;
  const items = Array.isArray(channel?.item)
    ? channel.item
    : channel?.item
      ? [channel.item]
      : [];
  if (!items.length) throw new Error('Podcast RSS did not contain episodes');
  const seen = new Map<string, number>();
  const episodes: PodcastEpisode[] = items.map(
    (item: Record<string, unknown>) => {
      const title = text(item.title).trim();
      const baseSlug = slugify(title);
      const occurrence = (seen.get(baseSlug) || 0) + 1;
      seen.set(baseSlug, occurrence);
      const audioUrl = attr(item.enclosure, 'url');
      const publishedAt = new Date(text(item.pubDate));
      if (!title || !audioUrl || Number.isNaN(publishedAt.valueOf()))
        throw new Error(`Invalid episode: ${title || '(untitled)'}`);
      const itunes = item['itunes:image'];
      return {
        id: text(item.guid) || audioUrl,
        slug:
          occurrence === 1
            ? baseSlug
            : `${baseSlug}-${publishedAt.toISOString().slice(0, 10)}`,
        title,
        description: sanitizeEpisodeHtml(
          text(item.description) || text(item['itunes:summary']),
        ),
        publishedAt: publishedAt.toISOString(),
        duration: text(item['itunes:duration']) || undefined,
        artwork:
          attr(itunes, 'href') ||
          attr(channel?.['itunes:image'], 'href') ||
          undefined,
        audioUrl,
        spotifyUrl:
          text(item.link) ||
          'https://open.spotify.com/show/7es718XuZbCWSm6D0cErsi',
      };
    },
  );
  return episodes.sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
}

async function main() {
  const response = await fetch(PODCAST_FEED, {
    headers: { 'user-agent': 'Gamefoss-site-builder/1.0' },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok)
    throw new Error(`Podcast RSS request failed: ${response.status}`);
  const episodes = parsePodcast(await response.text());
  await mkdir('.cache', { recursive: true });
  await writeFile(
    '.cache/episodes.json',
    `${JSON.stringify(episodes, null, 2)}\n`,
  );
  console.log(`Synced ${episodes.length} podcast episodes.`);
}

if (process.env.VITEST !== 'true')
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
