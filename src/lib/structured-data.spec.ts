import { describe, expect, it } from 'vitest';
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  podcastSeriesJsonLd,
  siteUrl,
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
});
