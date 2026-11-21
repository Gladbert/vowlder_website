// Local stand-in for the shared store. The guest app only ever needed one helper
// outside its own state, so this replaces Supabase entirely.

/** Turn a YouTube watch/shorts/youtu.be URL into an embeddable one. */
export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;

  const shorts = url.match(/youtube\.com\/shorts\/([\w-]+)/);
  if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`;

  const watch = url.match(/[?&]v=([\w-]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;

  const short = url.match(/youtu\.be\/([\w-]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;

  return null;
}
