// Image compression utility
// Converts any image File to a JPEG with max width constraint to dramatically reduce upload time

export async function compressImage(
  file: File,
  maxWidth = 1920,
  quality = 0.85
): Promise<File> {
  try {
    const originalUrl = URL.createObjectURL(file);

    // Prefer createImageBitmap for faster decode
    let bitmap: ImageBitmap | null = null;
    try {
      bitmap = await createImageBitmap(await fetch(originalUrl).then(r => r.blob()));
    } catch {
      bitmap = null;
    }

    let imgWidth = 0;
    let imgHeight = 0;

    if (bitmap) {
      imgWidth = bitmap.width;
      imgHeight = bitmap.height;
    } else {
      // Fallback to HTMLImageElement
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.crossOrigin = 'anonymous';
        image.src = originalUrl;
      });
      imgWidth = img.naturalWidth;
      imgHeight = img.naturalHeight;
    }

    // Calculate target size
    const scale = imgWidth > maxWidth ? maxWidth / imgWidth : 1;
    const targetWidth = Math.round(imgWidth * scale);
    const targetHeight = Math.round(imgHeight * scale);

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas not supported');

    if (bitmap) {
      ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
      bitmap.close();
    } else {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.crossOrigin = 'anonymous';
        image.src = originalUrl;
      });
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    }

    URL.revokeObjectURL(originalUrl);

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Compression failed'))),
        'image/jpeg',
        quality
      );
    });

    const newName = file.name.replace(/\.[^.]+$/, '.jpg');
    return new File([blob], newName, { type: 'image/jpeg' });
  } catch (e) {
    // On any failure, return original file
    return file;
  }
}
