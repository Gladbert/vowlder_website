/**
 * Vite in this project hands back an ImageMetadata object for image imports, while
 * the original app expected a URL string. One helper, applied at every use site.
 */
export const assetUrl = (asset: string | { src: string } | undefined): string =>
  typeof asset === 'string' ? asset : (asset?.src ?? '');
