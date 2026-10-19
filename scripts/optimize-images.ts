import { readdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const supportedExtensions = new Set([
  '.avif',
  '.jpeg',
  '.jpg',
  '.png',
  '.webp',
]);

export interface ImageOptimizationReport {
  scanned: number;
  optimized: number;
  unchanged: number;
  originalBytes: number;
  outputBytes: number;
}

async function imageFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? imageFiles(path) : [path];
    }),
  );

  return nested
    .flat()
    .filter((path) => supportedExtensions.has(extname(path).toLowerCase()))
    .sort();
}

async function encodeImage(input: Buffer, extension: string): Promise<Buffer> {
  const pipeline = sharp(input).rotate();

  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    case '.png':
      return pipeline.png({ compressionLevel: 9, effort: 10 }).toBuffer();
    case '.webp':
      return pipeline.webp({ quality: 82, effort: 6 }).toBuffer();
    case '.avif':
      return pipeline.avif({ quality: 50, effort: 6 }).toBuffer();
    default:
      return input;
  }
}

export async function optimizeImages(
  directory = 'dist/images',
): Promise<ImageOptimizationReport> {
  const paths = await imageFiles(directory);
  const report: ImageOptimizationReport = {
    scanned: paths.length,
    optimized: 0,
    unchanged: 0,
    originalBytes: 0,
    outputBytes: 0,
  };

  for (const path of paths) {
    const input = await readFile(path);
    const metadata = await sharp(input, { animated: true }).metadata();
    if ((metadata.pages || 1) > 1) {
      report.originalBytes += input.length;
      report.outputBytes += input.length;
      report.unchanged += 1;
      continue;
    }
    const output = await encodeImage(input, extname(path).toLowerCase());
    report.originalBytes += input.length;

    if (output.length >= input.length) {
      report.unchanged += 1;
      report.outputBytes += input.length;
      continue;
    }

    const temporaryPath = `${path}.optimize-${process.pid}`;
    try {
      await writeFile(temporaryPath, output);
      await rename(temporaryPath, path);
    } finally {
      await rm(temporaryPath, { force: true });
    }

    report.optimized += 1;
    report.outputBytes += output.length;
  }

  return report;
}

function formatBytes(bytes: number): string {
  return new Intl.NumberFormat('en', {
    maximumFractionDigits: 1,
    style: 'unit',
    unit: 'megabyte',
    unitDisplay: 'short',
  }).format(bytes / 1_000_000);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const directory = process.argv[2] || 'dist/images';
  const report = await optimizeImages(directory);
  const saved = report.originalBytes - report.outputBytes;
  const percentage = report.originalBytes
    ? ((saved / report.originalBytes) * 100).toFixed(1)
    : '0.0';

  console.log(
    `Optimized ${report.optimized}/${report.scanned} images in ${directory}; ` +
      `${report.unchanged} already optimal; saved ${formatBytes(saved)} (${percentage}%).`,
  );
}
