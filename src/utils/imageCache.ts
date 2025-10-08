import { get, set } from 'idb-keyval';

export const cacheBlob = async (key: string, blob: Blob) => {
  try {
    await set(key, blob);
  } catch (e) {
    // Ignore caching failures
  }
};

export const getCachedBlob = async (key: string): Promise<Blob | undefined> => {
  try {
    const blob = await get<Blob>(key);
    return blob || undefined;
  } catch {
    return undefined;
  }
};

export const getCachedImageUrl = async (key: string): Promise<string | undefined> => {
  const blob = await getCachedBlob(key);
  if (!blob) return undefined;
  return URL.createObjectURL(blob);
};

export function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, base64] = dataUrl.split(',');
  const mimeMatch = /data:(.*?);base64/.exec(meta);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export function hashString(input: string): string {
  // Simple djb2 hash
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}
