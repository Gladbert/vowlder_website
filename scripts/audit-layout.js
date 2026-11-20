// Layout audit used instead of eyeballing: real overlap, clipping, overflow, and
// contrast — computed against the *clipped* rect, so scroll containers and the
// cover gate do not produce false positives. Run with `agent-browser eval --stdin`.
(() => {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const report = {
    viewport: [vw, vh],
    hOverflow: [],
    textOverlap: [],
    clipped: [],
    lowContrast: [],
    coverCta: null,
    revealNodes: 0,
    fonts: {},
  };

  report.fonts.cormorant = document.fonts.check('16px "Cormorant Garamond Variable"');
  report.fonts.inter = document.fonts.check('16px "Inter Variable"');

  // Tailwind v4 emits oklab/oklch/color-mix, which canvas fillStyle rejects on this
  // Chromium — so parse the colour formats instead of round-tripping through canvas.
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const gamma = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
  const oklabToRgb = (L, a, b) => {
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return [
      gamma(clamp01(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)) * 255,
      gamma(clamp01(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)) * 255,
      gamma(clamp01(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)) * 255,
    ];
  };
  const nums = (str) => (str.match(/-?[\d.]+%?/g) || []).map((v) => (v.endsWith('%') ? parseFloat(v) / 100 : parseFloat(v)));
  const parseColor = (raw) => {
    if (!raw) return null;
    if (raw.startsWith('color-mix')) {
      const first = raw.match(/[\w-]*\([^()]*\)|#[\da-f]{3,8}/gi) || [];
      const inner = parseColor(first[1] || '') || parseColor(first[0] || '');
      const pct = nums(raw.split(',').slice(1).join(','))[1];
      return inner ? [inner[0], inner[1], inner[2], inner[3] * (pct ?? 1)] : null;
    }
    if (raw.startsWith('#')) {
      const h = raw.slice(1);
      const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
      return [
        parseInt(full.slice(0, 2), 16),
        parseInt(full.slice(2, 4), 16),
        parseInt(full.slice(4, 6), 16),
        full.length === 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1,
      ];
    }
    const n = nums(raw);
    if (raw.startsWith('rgb')) return [n[0], n[1], n[2], n[3] === undefined ? 1 : n[3]];
    if (raw.startsWith('oklab')) return [...oklabToRgb(n[0], n[1], n[2]), n[3] === undefined ? 1 : n[3]];
    if (raw.startsWith('oklch')) {
      const rad = (n[2] * Math.PI) / 180;
      return [...oklabToRgb(n[0], n[1] * Math.cos(rad), n[1] * Math.sin(rad)), n[3] === undefined ? 1 : n[3]];
    }
    return null;
  };

  const clipOf = (el) => {
    let box = { top: 0, left: 0, right: vw, bottom: vh };
    for (let node = el.parentElement; node; node = node.parentElement) {
      const s = getComputedStyle(node);
      if (/hidden|auto|scroll/.test(s.overflowY + s.overflowX)) {
        const r = node.getBoundingClientRect();
        box = {
          top: Math.max(box.top, r.top),
          left: Math.max(box.left, r.left),
          right: Math.min(box.right, r.right),
          bottom: Math.min(box.bottom, r.bottom),
        };
      }
    }
    return box;
  };

  const clippedRect = (el) => {
    const r = el.getBoundingClientRect();
    const c = clipOf(el);
    const top = Math.max(r.top, c.top);
    const left = Math.max(r.left, c.left);
    const right = Math.min(r.right, c.right);
    const bottom = Math.min(r.bottom, c.bottom);
    if (right - left < 2 || bottom - top < 2) return null;
    return { top, left, right, bottom, width: right - left, height: bottom - top };
  };

  const visible = (el) => {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) < 0.05) return false;
    return true;
  };

  const label = (el) => {
    const cls = (typeof el.className === 'string' ? el.className : '').split(/\s+/).slice(0, 2).join('.');
    return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}[${(el.textContent || '').trim().slice(0, 22)}]`;
  };

  const inScroller = (el) => {
    for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
      const ox = getComputedStyle(node).overflowX;
      if ((ox === 'auto' || ox === 'scroll') && node.scrollWidth > node.clientWidth + 1) return true;
    }
    return false;
  };

  // An ancestor that clips means the overflow is contained by design (a Ken Burns
  // image inside overflow-hidden is not a bug). Real page overflow is checked
  // separately via documentElement.scrollWidth in the harness.
  const contained = (el) => {
    for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
      if (getComputedStyle(node).overflowX !== 'visible') return true;
    }
    return false;
  };

  // 1. Horizontal overflow past the viewport (scrollable strips and clipped boxes excluded)
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el) || inScroller(el) || contained(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width && (r.right > vw + 1 || r.left < -1)) {
      report.hOverflow.push({ el: label(el), left: Math.round(r.left), right: Math.round(r.right) });
    }
    if (report.hOverflow.length > 6) break;
  }

  const layerOf = (el) => {
    for (let node = el; node; node = node.parentElement) {
      const z = getComputedStyle(node).zIndex;
      if (z !== 'auto') return z;
    }
    return 'auto';
  };

  // 2. Text-on-text overlap in the visible clip area
  const textEls = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el)) continue;
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own) continue;
    const box = clippedRect(el);
    if (!box) continue;
    textEls.push({ el, box });
    if (textEls.length > 500) break;
  }
  for (let i = 0; i < textEls.length; i++) {
    for (let j = i + 1; j < textEls.length; j++) {
      const a = textEls[i], b = textEls[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      // Different stacking layers means one paints over the other: not a collision.
      if (layerOf(a.el) !== layerOf(b.el)) continue;
      const x = Math.min(a.box.right, b.box.right) - Math.max(a.box.left, b.box.left);
      const y = Math.min(a.box.bottom, b.box.bottom) - Math.max(a.box.top, b.box.top);
      if (x > 3 && y > 3) {
        report.textOverlap.push({ a: label(a.el), b: label(b.el), area: Math.round(x * y) });
        if (report.textOverlap.length > 5) break;
      }
    }
  }

  // 3. Text clipped by its own box
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el)) continue;
    const s = getComputedStyle(el);
    if (s.overflow === 'hidden' && el.clientHeight > 0 && el.scrollHeight > el.clientHeight + 3 && el.textContent.trim()) {
      if (el.getBoundingClientRect().height < 60) {
        report.clipped.push({ el: label(el), scroll: el.scrollHeight, client: el.clientHeight });
      }
    }
    if (report.clipped.length > 5) break;
  }

  // 4. Contrast against the nearest opaque background
  const lum = ([r, g, b]) => {
    const f = [r, g, b].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
  };
  // Composite every ancestor background from the document down, so a 90% overlay on
  // cream resolves to the colour actually painted behind the text.
  const bgOf = (el) => {
    const chain = [];
    for (let node = el; node; node = node.parentElement) chain.unshift(node);
    let out = [255, 255, 255, 1];
    for (const node of chain) {
      const rgba = parseColor(getComputedStyle(node).backgroundColor);
      if (!rgba || rgba[3] === 0) continue;
      out = [
        rgba[0] * rgba[3] + out[0] * (1 - rgba[3]),
        rgba[1] * rgba[3] + out[1] * (1 - rgba[3]),
        rgba[2] * rgba[3] + out[2] * (1 - rgba[3]),
        1,
      ];
    }
    return out;
  };
  for (const { el } of textEls) {
    const fg = parseColor(getComputedStyle(el).color);
    if (!fg) continue;
    const bg = bgOf(el);
    const L1 = lum(fg), L2 = lum(bg);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const size = parseFloat(getComputedStyle(el).fontSize);
    const min = size >= 24 ? 3 : 4.5;
    if (ratio < min) report.lowContrast.push({ el: label(el), ratio: Number(ratio.toFixed(2)), size });
    if (report.lowContrast.length > 6) break;
  }

  // 5. Motion must actually be wired up on every template.
  report.revealNodes = document.querySelectorAll('[data-reveal]').length;

  // 6. The cover gate's primary action must be fully visible without scrolling.
  const cta = [...document.querySelectorAll('button')].find((el) =>
    (el.textContent || '').includes('Buka Undangan')
  );
  if (cta) {
    const r = cta.getBoundingClientRect();
    report.coverCta = {
      visible: r.top >= -1 && r.bottom <= vh + 1 && r.left >= -1 && r.right <= vw + 1,
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
    };
  }

  return JSON.stringify(report, null, 1);
})();
