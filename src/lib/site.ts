export const SITE_NAME = 'Gamefoss';
export const SITE_URL = 'https://gamefoss.com.br';
export const SITE_DESCRIPTION =
  'Games, tecnologia, sociedade e o que mais der na telha.';
export const YOUTUBE_CHANNEL_ID = 'UC-56xFSGCZva048yeG-wFTw';

export const SITE_SOCIALS = {
  spotify: 'https://open.spotify.com/show/7es718XuZbCWSm6D0cErsi',
  twitter: 'https://twitter.com/game_foss',
  instagram: 'https://www.instagram.com/game_foss/',
  youtube: 'https://www.youtube.com/@game_foss',
  twitch: 'https://www.twitch.tv/game_foss',
} as const;
export const PODCAST_LINKS = {
  feed: 'https://anchor.fm/s/4c499e08/podcast/rss',
  spotify: 'https://open.spotify.com/show/7es718XuZbCWSm6D0cErsi',
  apple: 'https://podcasts.apple.com/us/podcast/gamefoss/id1455626041',
  castbox: 'https://castbox.fm/channel/Gamefoss-id2058011',
} as const;

export const DISQUS_SHORTNAME = 'gamefoss';

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
