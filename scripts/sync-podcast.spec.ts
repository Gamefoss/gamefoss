import { describe, expect, it } from 'vitest';
import { parsePodcast } from './sync-podcast';

const feed = `<?xml version="1.0"?><rss><channel><itunes:image href="https://img.test/show.jpg"/><item><title><![CDATA[Olá, mundo!]]></title><description><![CDATA[<p>Seguro</p><script>alert(1)</script>]]></description><guid>one</guid><pubDate>Fri, 09 Oct 2026 12:00:00 GMT</pubDate><link>https://spotify.test/one</link><enclosure url="https://audio.test/one.mp3"/><itunes:duration>12:34</itunes:duration></item></channel></rss>`;
describe('parsePodcast', () => { it('normalizes and sanitizes RSS episodes', () => { const [episode]=parsePodcast(feed); expect(episode.slug).toBe('ola-mundo'); expect(episode.description).toBe('<p>Seguro</p>'); expect(episode.audioUrl).toContain('.mp3'); }); it('rejects empty feeds', () => expect(() => parsePodcast('<rss><channel/></rss>')).toThrow()); });
