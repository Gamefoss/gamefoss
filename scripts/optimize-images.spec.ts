import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { afterEach, describe, expect, it } from 'vitest';
import { optimizeImages } from './optimize-images';

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

async function temporaryDirectory(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'gamefoss-images-'));
  temporaryDirectories.push(directory);
  return directory;
}

describe('optimizeImages', () => {
  it('compresses supported images without changing their path', async () => {
    const directory = await temporaryDirectory();
    const imagePath = join(directory, 'photo.jpg');
    const pixels = Buffer.alloc(200 * 100 * 3);
    for (let index = 0; index < pixels.length; index += 1) {
      pixels[index] = (index * 47) % 256;
    }
    const original = await sharp(pixels, {
      raw: { width: 200, height: 100, channels: 3 },
    })
      .jpeg({ quality: 100 })
      .withMetadata({ orientation: 6 })
      .toBuffer();
    await writeFile(imagePath, original);

    const report = await optimizeImages(directory);
    const optimized = await readFile(imagePath);
    const metadata = await sharp(optimized).metadata();

    expect(report).toMatchObject({ scanned: 1, optimized: 1, unchanged: 0 });
    expect(optimized.length).toBeLessThan(original.length);
    expect(metadata.orientation).toBeUndefined();
    expect(metadata.width).toBe(100);
    expect(metadata.height).toBe(200);
  });

  it('ignores unsupported assets', async () => {
    const directory = await temporaryDirectory();
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
    await writeFile(join(directory, 'icon.svg'), svg);

    const report = await optimizeImages(directory);

    expect(report).toEqual({
      scanned: 0,
      optimized: 0,
      unchanged: 0,
      originalBytes: 0,
      outputBytes: 0,
    });
    expect(await readFile(join(directory, 'icon.svg'), 'utf8')).toBe(svg);
  });

  it('keeps the original when re-encoding would not reduce its size', async () => {
    const directory = await temporaryDirectory();
    const imagePath = join(directory, 'pixel.png');
    const original = await sharp({
      create: {
        width: 1,
        height: 1,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .png({ compressionLevel: 9, effort: 10 })
      .toBuffer();
    await writeFile(imagePath, original);

    const report = await optimizeImages(directory);

    expect(report).toMatchObject({ scanned: 1, optimized: 0, unchanged: 1 });
    expect(await readFile(imagePath)).toEqual(original);
  });
});
