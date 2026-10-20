import { describe, expect, it } from 'vitest';
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  podcastSeriesJsonLd,
  siteUrl,
  videoObjectJsonLd,
  websiteJsonLd,
} from './structured-data';

const previewSite = new URL('https://gamefoss.com.br/dev/');

describe('structured data', () => {
  it('keeps canonical schema URLs on the production origin', () => {
    expect(siteUrl(previewSite, '/blog/exemplo/')).toBe(
      'https://gamefoss.com.br/blog/exemplo/',
    );
  });

  it('connects the website and podcast to the organization', () => {
    const organization = organizationJsonLd(previewSite);
    const website = websiteJsonLd(previewSite);
    const podcast = podcastSeriesJsonLd(previewSite);

    expect(organization['@id']).toBe('https://gamefoss.com.br/#organization');
    expect(website.publisher).toMatchObject({
      '@id': 'https://gamefoss.com.br/#organization',
    });
    expect(podcast.publisher).toMatchObject({
      '@id': 'https://gamefoss.com.br/#organization',
    });
  });

  it('builds ordered, absolute breadcrumb items', () => {
    const breadcrumbs = breadcrumbJsonLd(previewSite, [
      { name: 'Início', path: '/' },
      { name: 'Blog', path: '/blog/' },
    ]);

    expect(breadcrumbs.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: 'https://gamefoss.com.br/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://gamefoss.com.br/blog/',
      },
    ]);
  });

  it('builds canonical video metadata with a privacy-enhanced embed', () => {
    const video = videoObjectJsonLd(previewSite, {
      id: 'abc123',
      slug: 'video-exemplo',
      title: 'Vídeo exemplo',
      description: 'Descrição',
      thumbnail: 'https://img.test/video.jpg',
      publishedAt: '2026-10-20T12:00:00.000Z',
      durationSeconds: 181,
      youtubeUrl: 'https://www.youtube.com/watch?v=abc123',
    });

    expect(video.url).toBe('https://gamefoss.com.br/videos/video-exemplo/');
    expect(video.embedUrl).toBe(
      'https://www.youtube-nocookie.com/embed/abc123',
    );
    expect(video.publisher).toMatchObject({
      '@id': 'https://gamefoss.com.br/#organization',
    });
  });
});
