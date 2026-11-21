/**
 * Print `html` from an isolated hidden iframe instead of the app document.
 * `window.print()` on the main document takes over the app's layout and prints
 * every screenful of it; a separate iframe document renders ONLY the supplied
 * markup, so a pass/ticket always prints on a single page. Inline data-URL
 * images (QR + logo) are in the markup before `print()` is called.
 *
 * @param pageSize CSS size for the `@page` rule, e.g. `'auto'`, `'95mm'`, `'48mm auto'`.
 */
/**
 * `allow-same-origin` is required for `win.print()` and for reading
 * `doc.images`, but `allow-scripts` is deliberately absent: the document cannot
 * execute JavaScript, so an unescaped interpolation cannot become an XSS.
 */
const SANDBOX = 'allow-same-origin allow-modals';

/** No script source at all; images restricted to inline data URLs and the
 *  app's own origin (logo + QR are both data URLs). */
const PRINT_CSP =
  "default-src 'none'; img-src data: 'self'; style-src 'unsafe-inline'; font-src data:; base-uri 'none'; form-action 'none'";

export function printHtmlIsolated(html: string, pageSize: string = 'auto', waitMs = 1200): boolean {
  if (typeof document === 'undefined') return false;
  try {
    document.getElementById('gm-print-frame')?.remove();
    const frame = document.createElement('iframe');
    frame.id = 'gm-print-frame';
    frame.setAttribute('aria-hidden', 'true');
    frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
    document.body.appendChild(frame);

    const win = frame.contentWindow;
    const doc = win?.document;
    if (!win || !doc) {
      frame.remove();
      return false;
    }

    // Defence in depth: the frame is same-origin, so any markup that slips past
    // the caller's escaping would be live script with the app's authority. No
    // scripts, no remote subresources, and a CSP with no script source at all —
    // so even an escaping mistake cannot execute.
    frame.setAttribute('sandbox', SANDBOX);
    doc.open();
    doc.write(
      `<!doctype html><html><head><meta charset="utf-8">` +
        `<meta http-equiv="Content-Security-Policy" content="${PRINT_CSP}">` +
        `<style>@page{size:${pageSize};margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0;background:#fff;color:#000}</style>` +
        `</head><body>${html}</body></html>`
    );
    doc.close();

    let printed = false;
    const fire = () => {
      if (printed) return;
      printed = true;
      try {
        win.focus();
        win.print();
      } catch (err) {
        console.warn('Isolated print failed:', err);
      }
      window.setTimeout(() => frame.remove(), 1000);
    };

    const pending = Array.from(doc.images || []).filter((img) => !img.complete);
    if (!pending.length) {
      // No images to wait on: print immediately (matches the previous
      // synchronous iframe behaviour and keeps print() observable to callers).
      fire();
    } else {
      let remaining = pending.length;
      const onDone = () => {
        if (--remaining <= 0) fire();
      };
      pending.forEach((img) => {
        img.addEventListener('load', onDone, { once: true });
        img.addEventListener('error', onDone, { once: true });
      });
    }
    // Safety net so a stalled image can never leave the dialog un-fired.
    window.setTimeout(fire, waitMs);
    return true;
  } catch (err) {
    console.warn('Isolated print surface unavailable:', err);
    return false;
  }
}
