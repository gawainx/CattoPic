import { getFullUrl } from './baseUrl';

export interface CdnCgiImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif';
  fit?: 'scale-down' | 'cover' | 'contain';
}

function clampInt(value: unknown, min: number, max: number): number {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return min;
  return Math.max(min, Math.min(max, Math.trunc(num)));
}

function buildOptionsString(options: CdnCgiImageOptions): string {
  const parts: string[] = [];
  if (options.width) parts.push(`width=${clampInt(options.width, 1, 4096)}`);
  if (options.height) parts.push(`height=${clampInt(options.height, 1, 4096)}`);
  parts.push(`fit=${options.fit || 'scale-down'}`);
  parts.push(`quality=${clampInt(options.quality ?? 75, 1, 100)}`);
  parts.push(`format=${options.format || 'auto'}`);
  return parts.join(',');
}

export function toCdnCgiImageUrl(inputUrl: string, options: CdnCgiImageOptions): string {
  const fullUrl = getFullUrl(inputUrl);
  if (!fullUrl) return '';

  let url: URL;
  try {
    url = new URL(fullUrl);
  } catch {
    return fullUrl;
  }

  const optionsString = buildOptionsString(options);
  const prefix = '/cdn-cgi/image/';

  if (url.pathname.startsWith(prefix)) {
    const rest = url.pathname.slice(prefix.length);
    const slashIndex = rest.indexOf('/');
    if (slashIndex === -1) {
      return fullUrl;
    }
    const originPath = rest.slice(slashIndex);
    url.pathname = `${prefix}${optionsString}${originPath}`;
    return url.toString();
  }

  url.pathname = `${prefix}${optionsString}${url.pathname}`;
  return url.toString();
}

