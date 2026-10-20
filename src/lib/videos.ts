import sanitizeHtml from 'sanitize-html';

export interface YouTubeVideo {
  id: string;
  slug: string;
  title: string;
  description: string;
  descriptionText: string;
  publishedAt: string;
  durationSeconds: number;
  thumbnail: string;
  youtubeUrl: string;
}

export const SHORT_VIDEO_MAX_DURATION_SECONDS = 180;

export function parseYouTubeDuration(value: string) {
  const match = value.match(
    /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/,
  );
  if (!match) throw new Error(`Invalid YouTube duration: ${value}`);
  const [, days = '0', hours = '0', minutes = '0', seconds = '0'] = match;
  return (
    Number(days) * 86_400 +
    Number(hours) * 3_600 +
    Number(minutes) * 60 +
    Number(seconds)
  );
}

export function formatVideoDuration(durationSeconds: number) {
  const hours = Math.floor(durationSeconds / 3_600);
  const minutes = Math.floor((durationSeconds % 3_600) / 60);
  const seconds = durationSeconds % 60;
  return hours
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function formatYouTubeDescription(value: string) {
  const escaped = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  const linked = escaped.replace(/https?:\/\/[^\s<]+/g, (match) => {
    const trailing = match.match(/[),.!?:;]+$/)?.[0] || '';
    const url = trailing ? match.slice(0, -trailing.length) : match;
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>${trailing}`;
  });
  const paragraphs = linked
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('');

  return sanitizeHtml(paragraphs, {
    allowedTags: ['p', 'a', 'br'],
    allowedAttributes: { a: ['href', 'target', 'rel'] },
    allowedSchemes: ['http', 'https'],
  });
}

export function normalizeVideoDescription(value: string) {
  return value.replace(/\r\n/g, '\n').trim();
}
