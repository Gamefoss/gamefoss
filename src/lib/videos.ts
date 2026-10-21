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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function linkifyYouTubeDescription(value: string) {
  const tokens = /https?:\/\/[^\s<]+|(?<![\p{L}\p{N}_])#[\p{L}\p{N}_]+/gu;
  let result = '';
  let lastIndex = 0;

  for (const match of value.matchAll(tokens)) {
    const index = match.index;
    result += escapeHtml(value.slice(lastIndex, index));

    if (match[0].startsWith('#')) {
      const tag = match[0].slice(1);
      result += `<a href="https://www.youtube.com/hashtag/${encodeURIComponent(tag)}" target="_blank" rel="noopener noreferrer">${escapeHtml(match[0])}</a>`;
      lastIndex = index + match[0].length;
      continue;
    }

    const trailing = match[0].match(/[),.!?:;]+$/)?.[0] || '';
    const url = trailing ? match[0].slice(0, -trailing.length) : match[0];
    const escapedUrl = escapeHtml(url);
    result += `<a href="${escapedUrl}" target="_blank" rel="noopener noreferrer">${escapedUrl}</a>${escapeHtml(trailing)}`;
    lastIndex = index + match[0].length;
  }

  return result + escapeHtml(value.slice(lastIndex));
}

export function formatYouTubeDescription(value: string) {
  const linked = linkifyYouTubeDescription(value);
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
