import sanitizeHtml from 'sanitize-html';

export interface PodcastEpisode {
  id: string;
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  duration?: string;
  artwork?: string;
  audioUrl: string;
  spotifyUrl: string;
}

export const DEFAULT_EPISODE_ARTWORK = '/images/podcast/default-artwork.png';

export function getEpisodeArtwork(episode: PodcastEpisode) {
  return episode.artwork || DEFAULT_EPISODE_ARTWORK;
}

export function sanitizeEpisodeHtml(value: string) {
  return sanitizeHtml(value, {
    allowedTags: [
      'p',
      'h2',
      'h3',
      'ul',
      'ol',
      'li',
      'strong',
      'em',
      'a',
      'br',
      'blockquote',
    ],
    allowedAttributes: { a: ['href', 'title', 'target', 'rel'] },
    transformTags: {
      a: (_tag, attrs) => ({
        tagName: 'a',
        attribs: { ...attrs, rel: 'noopener noreferrer', target: '_blank' },
      }),
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
}

export function removeHtmlTags(value: string) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
