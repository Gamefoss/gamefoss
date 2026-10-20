import {
  PODCAST_LINKS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SOCIALS,
  SITE_URL,
} from './site';

export type JsonLd = Record<string, unknown>;

interface BreadcrumbItem {
  name: string;
  path: string;
}

export function siteUrl(site: URL | undefined, path = '/') {
  const origin = site?.origin || SITE_URL;
  return new URL(path, `${origin}/`).href;
}

export function organizationId(site?: URL) {
  return `${siteUrl(site)}#organization`;
}

export function podcastSeriesId(site?: URL) {
  return `${siteUrl(site, '/podcast/')}#podcast-series`;
}

export function organizationReference(site?: URL): JsonLd {
  return {
    '@type': 'Organization',
    '@id': organizationId(site),
    name: SITE_NAME,
    url: siteUrl(site),
    logo: {
      '@type': 'ImageObject',
      url: siteUrl(site, '/favicon-196x196.png'),
      width: 196,
      height: 196,
    },
  };
}

export function podcastSeriesReference(site?: URL): JsonLd {
  return {
    '@type': 'PodcastSeries',
    '@id': podcastSeriesId(site),
    name: SITE_NAME,
    url: siteUrl(site, '/podcast/'),
  };
}

export function organizationJsonLd(site?: URL): JsonLd {
  return {
    '@context': 'https://schema.org',
    ...organizationReference(site),
    description: SITE_DESCRIPTION,
    sameAs: Object.values(SITE_SOCIALS),
  };
}

export function websiteJsonLd(site?: URL): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl(site)}#website`,
    name: SITE_NAME,
    url: siteUrl(site),
    description: SITE_DESCRIPTION,
    inLanguage: 'pt-BR',
    publisher: organizationReference(site),
  };
}

export function podcastSeriesJsonLd(site?: URL): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    '@id': podcastSeriesId(site),
    name: 'Gamefoss',
    url: siteUrl(site, '/podcast/'),
    description:
      'Conversas sobre jogos, tecnologia, sociedade e o que mais der na telha.',
    image: siteUrl(site, '/images/podcast/default-artwork.png'),
    webFeed: PODCAST_LINKS.feed,
    inLanguage: 'pt-BR',
    publisher: organizationReference(site),
    sameAs: [PODCAST_LINKS.spotify, PODCAST_LINKS.apple, PODCAST_LINKS.castbox],
  };
}

export function videoObjectJsonLd(
  site: URL | undefined,
  video: {
    id: string;
    slug: string;
    title: string;
    description: string;
    thumbnail: string;
    publishedAt: string;
    durationSeconds: number;
    youtubeUrl: string;
  },
): JsonLd {
  const url = siteUrl(site, `/videos/${video.slug}/`);
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': `${url}#video`,
    name: video.title,
    description: video.description.slice(0, 500),
    thumbnailUrl: [video.thumbnail],
    uploadDate: video.publishedAt,
    duration: `PT${video.durationSeconds}S`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}`,
    contentUrl: video.youtubeUrl,
    url,
    inLanguage: 'pt-BR',
    publisher: organizationReference(site),
  };
}

export function breadcrumbJsonLd(
  site: URL | undefined,
  items: BreadcrumbItem[],
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: siteUrl(site, item.path),
    })),
  };
}
