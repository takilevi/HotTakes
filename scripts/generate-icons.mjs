import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const sizes = [192, 512];

const colors = {
  bg: [17, 19, 24, 255],
  hot: [244, 93, 95, 255],
  warm: [246, 200, 95, 255],
  ink: [248, 243, 232, 255],
};

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  const crc = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function setPixel(pixels, size, x, y, color) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  const index = (y * size + x) * 4;
  pixels[index] = color[0];
  pixels[index + 1] = color[1];
  pixels[index + 2] = color[2];
  pixels[index + 3] = color[3];
}

function roundedRect(pixels, size, x, y, width, height, radius, color) {
  for (let py = y; py < y + height; py += 1) {
    for (let px = x; px < x + width; px += 1) {
      const dx = Math.max(x - px, 0, px - (x + width - 1));
      const dy = Math.max(y - py, 0, py - (y + height - 1));
      const cornerX = px < x + radius ? x + radius : px >= x + width - radius ? x + width - radius - 1 : px;
      const cornerY = py < y + radius ? y + radius : py >= y + height - radius ? y + height - radius - 1 : py;
      const insideCorner = (px - cornerX) ** 2 + (py - cornerY) ** 2 <= radius ** 2;
      if ((dx === 0 && dy === 0) || insideCorner) setPixel(pixels, size, px, py, color);
    }
  }
}

function ellipse(pixels, size, cx, cy, rx, ry, color) {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y += 1) {
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x += 1) {
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) {
        setPixel(pixels, size, x, y, color);
      }
    }
  }
}

function line(pixels, size, x1, y1, x2, y2, width, color) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
  for (let step = 0; step <= steps; step += 1) {
    const t = step / steps;
    const x = Math.round(x1 + (x2 - x1) * t);
    const y = Math.round(y1 + (y2 - y1) * t);
    ellipse(pixels, size, x, y, width / 2, width / 2, color);
  }
}

function createIcon(size) {
  const pixels = Buffer.alloc(size * size * 4);
  const scale = size / 512;

  roundedRect(pixels, size, 0, 0, size, size, 96 * scale, colors.bg);
  ellipse(pixels, size, 276 * scale, 340 * scale, 170 * scale, 132 * scale, colors.hot);
  ellipse(pixels, size, 298 * scale, 382 * scale, 102 * scale, 82 * scale, colors.warm);
  ellipse(pixels, size, 244 * scale, 290 * scale, 72 * scale, 116 * scale, colors.hot);
  ellipse(pixels, size, 322 * scale, 262 * scale, 56 * scale, 82 * scale, colors.hot);
  line(pixels, size, 169 * scale, 143 * scale, 343 * scale, 143 * scale, 30 * scale, colors.ink);
  line(pixels, size, 151 * scale, 196 * scale, 263 * scale, 196 * scale, 24 * scale, colors.ink);

  const rows = [];
  for (let y = 0; y < size; y += 1) {
    rows.push(Buffer.from([0]));
    rows.push(pixels.subarray(y * size * 4, (y + 1) * size * 4));
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(Buffer.concat(rows))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const size of sizes) {
  writeFileSync(`assets/icon-${size}.png`, createIcon(size));
}
