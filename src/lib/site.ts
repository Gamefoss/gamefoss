export const SITE_NAME = 'Gamefoss';
export const SITE_DESCRIPTION =
  'Games, tecnologia, sociedade e o que mais der na telha.';
export const PODCAST_FEED = 'https://anchor.fm/s/4c499e08/podcast/rss';
export const SPOTIFY_SHOW =
  'https://open.spotify.com/show/7es718XuZbCWSm6D0cErsi';

export function withBase(path = '/') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}` || '/';
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(date));
}

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
