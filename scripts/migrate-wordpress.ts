import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';
import sanitizeHtml from 'sanitize-html';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

interface Manifest { source: string; entries: number[]; }
interface WpPost { id:number; slug:string; date:string; link:string; author:number; title:{rendered:string}; excerpt:{rendered:string}; content:{rendered:string}; _embedded?:Record<string, unknown[]>; }
const decode = (value:string) => value.replace(/&#038;/g, '&').replace(/&#8211;/g, '–').replace(/&#8217;/g, '’').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const yaml = (value:string) => JSON.stringify(decode(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const report = { migrated: [] as string[], redirects: [] as string[], missingImages: [] as string[], unsupportedMarkup: [] as string[] };

export function htmlToMarkdown(html:string) {
  const turndown = new TurndownService({
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '_',
    headingStyle: 'atx',
    strongDelimiter: '**',
  });
  turndown.use(gfm);
  turndown.addRule('youtube', {
    filter: (node) => node.nodeName === 'IFRAME' && /(?:youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)/i.test(node.getAttribute('src') || ''),
    replacement: (_content, node) => {
      const element = node as HTMLElement;
      const source = element.getAttribute('src') || '';
      const id = source.match(/\/embed\/([^?&/]+)/i)?.[1] || '';
      const title = element.getAttribute('title') || 'Vídeo incorporado';
      return `\n\n<YouTube id=${JSON.stringify(id)} title=${JSON.stringify(title)} />\n\n`;
    },
  });
  turndown.addRule('figure', {
    filter: 'figure',
    replacement: (content) => `\n\n${content.trim()}\n\n`,
  });
  return turndown.turndown(html)
    .replace(/(!\[[^\]]*\]\([^)]+\))[ \t]*(?=\S)/g, '$1\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+$/gm, '')
    .trim();
}

async function download(url:string, target:string) {
  try { const response = await fetch(url, { signal: AbortSignal.timeout(30_000) }); if (!response.ok) throw new Error(String(response.status)); await writeFile(target, Buffer.from(await response.arrayBuffer())); return true; }
  catch { report.missingImages.push(url); return false; }
}

async function main() {
  const manifest:Manifest = JSON.parse(await readFile('migration/ludokratia-manifest.json', 'utf8'));
  await Promise.all(['src/content/articles','src/content/authors','public/images/articles','reports/migration'].map((path) => mkdir(path, {recursive:true})));
  const authors = new Map<string, {name:string;bio:string}>();
  for (const id of manifest.entries) {
    const response = await fetch(`${manifest.source}/${id}?_embed`, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`WordPress entry ${id}: ${response.status}`);
    const post = await response.json() as WpPost;
    const embedded = post._embedded || {}; const authorData = (embedded.author?.[0] || {}) as Record<string, unknown>;
    const authorSlug = String(authorData.slug || `autor-${post.author}`); authors.set(authorSlug, { name:String(authorData.name || authorSlug), bio:decode(String(authorData.description || 'Autor do Gamefoss.')).replace(/<[^>]+>/g,'').trim() || 'Autor do Gamefoss.' });
    const termGroups = (embedded['wp:term'] || []) as Array<Array<Record<string, unknown>>>;
    const categories = termGroups.flat().filter((term) => term.taxonomy === 'ludokratia_categories').map((term) => String(term.name));
    const media = (embedded['wp:featuredmedia']?.[0] || {}) as Record<string, unknown>; const sourceUrl = String(media.source_url || '');
    let cover = ''; if (sourceUrl) { const extension = extname(new URL(sourceUrl).pathname) || '.jpg'; const filename = `cover${extension}`; const directory = `public/images/articles/${post.slug}`; await mkdir(directory,{recursive:true}); if (await download(sourceUrl, `${directory}/${filename}`)) cover = `/images/articles/${post.slug}/${filename}`; }
    let content = sanitizeHtml(post.content.rendered, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','figure','figcaption','iframe']), allowedAttributes: { a:['href','title','target','rel'], img:['src','alt','title','width','height','loading'], iframe:['src','title','allow','allowfullscreen','width','height'], '*':['class'] }, allowedSchemes:['http','https','mailto'] });
    const bodyImages = [...content.matchAll(/<img[^>]+src=["'](https?:\/\/gamefoss\.com\.br\/wp-content\/uploads\/[^"']+)["']/gi)];
    let imageNumber = 0;
    for (const match of bodyImages) {
      const url = match[1]; const extension = extname(new URL(url).pathname) || '.jpg'; const filename = `image-${++imageNumber}${extension}`;
      const directory = `public/images/articles/${post.slug}`; await mkdir(directory,{recursive:true});
      if (await download(url, `${directory}/${filename}`)) content = content.replaceAll(url, `../../../public/images/articles/${post.slug}/${filename}`);
    }
    content = content.replace(/<!--\s*\/?wp:[\s\S]*?-->/g, '');
    const markdown = htmlToMarkdown(content);
    if (/\[(?:gallery|caption|embed)/i.test(markdown) || /<(?!\/?YouTube\b)[a-z][^>]*>/i.test(markdown)) report.unsupportedMarkup.push(post.slug);
    const usesMdx = markdown.includes('<YouTube ');
    const componentImport = usesMdx ? "import YouTube from '@/components/YouTube.astro';\n\n" : '';
    const frontmatter = `---\ntitle: ${yaml(post.title.rendered)}\ndescription: ${yaml(post.excerpt.rendered).slice(0,400)}\npublishedAt: ${post.date}\nauthor: ${authorSlug}\ncategories: ${JSON.stringify(categories.length ? categories : ['Ludokratia'])}\n${cover ? `cover: ${cover}\ncoverAlt: ${yaml(String(media.alt_text || post.title.rendered))}\n` : ''}legacyUrl: ${post.link}\ndraft: false\nfeatured: false\n---\n\n`;
    const extension = usesMdx ? 'mdx' : 'md';
    const alternateExtension = usesMdx ? 'md' : 'mdx';
    await unlink(`src/content/articles/${post.slug}.${alternateExtension}`).catch(() => undefined);
    await writeFile(`src/content/articles/${post.slug}.${extension}`, frontmatter + componentImport + markdown + '\n');
    report.migrated.push(post.slug); report.redirects.push(`${new URL(post.link).pathname} /artigos/${post.slug}/`);
  }
  for (const [slug, author] of authors) await writeFile(`src/content/authors/${slug}.md`, `---\nname: ${yaml(author.name)}\nbio: ${yaml(author.bio)}\n---\n`);
  await writeFile('reports/migration/report.json', `${JSON.stringify(report,null,2)}\n`);
  await writeFile('public/legacy-redirects.conf', `${report.redirects.map((r) => `Redirect 301 ${r}`).join('\n')}\n`);
  console.log(`Migrated ${report.migrated.length} articles and ${authors.size} authors.`);
}
if (process.env.VITEST !== 'true') main().catch((error) => { console.error(error); process.exit(1); });
