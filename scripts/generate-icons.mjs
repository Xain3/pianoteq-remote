import { mkdir, writeFile } from 'node:fs/promises';
import { deflate } from 'node:zlib';
import { promisify } from 'node:util';

const compress = promisify(deflate);
const root = new URL('../apps/frontend/public/', import.meta.url);
const green = [35, 77, 67, 255];
const white = [245, 243, 238, 255];

function rounded(x, y, left, top, right, bottom, radius) {
  if (x < left || x > right || y < top || y > bottom) return false;
  const cx = Math.max(left + radius, Math.min(right - radius, x));
  const cy = Math.max(top + radius, Math.min(bottom - radius, y));
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2;
}

function pixel(x, y) {
  if (!rounded(x, y, 0, 0, 511, 511, 108)) return [0, 0, 0, 0];
  if (!rounded(x, y, 106, 110, 406, 402, 20)) return green;
  if ([166, 226, 286, 346].some((line) => Math.abs(x - line) < 3)) return green;
  if ([150, 211, 330].some((left) => rounded(x, y, left, 109, left + 34, 281, 6))) return green;
  return white;
}

function chunk(type, data) {
  const name = Buffer.from(type);
  let crc = 0xffffffff;
  for (const byte of Buffer.concat([name, data])) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  const output = Buffer.alloc(data.length + 12);
  output.writeUInt32BE(data.length, 0);
  name.copy(output, 4);
  data.copy(output, 8);
  output.writeUInt32BE((crc ^ 0xffffffff) >>> 0, data.length + 8);
  return output;
}

async function encode(size) {
  const stride = size * 4 + 1;
  const raw = Buffer.alloc(size * stride);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++)
      raw.set(pixel((x * 512) / size, (y * 512) / size), y * stride + 1 + x * 4);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', await compress(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

await mkdir(root, { recursive: true });
for (const size of [192, 512])
  await writeFile(new URL(`icon-${size}.png`, root), await encode(size));
console.log('Generated 192px and 512px PWA icons.');
