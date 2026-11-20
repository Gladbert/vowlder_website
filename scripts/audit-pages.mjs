// Local pre-push gate: renders every page at phone and desktop width and fails on
// real layout problems (overlap, overflow, clipping, contrast) plus missing fonts.
// Usage: node scripts/audit-pages.mjs [baseUrl]
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const base = process.argv[2] ?? 'http://localhost:4399';
const auditScript = readFileSync('scripts/audit-layout.js', 'utf8');

// Theme slugs come from the rendered catalogue, so this never drifts from themes.ts.
const html = await fetch(base).then((response) => response.text());
const slugs = [...new Set([...html.matchAll(/\/preview\/([\w-]+)\//g)].map((m) => m[1]))];

const browser = (...args) => execFileSync('agent-browser', args, { encoding: 'utf8' });
const evalJs = (code) => {
  const raw = execFileSync('agent-browser', ['eval', code], { encoding: 'utf8' }).trim();
  try {
    const once = JSON.parse(raw);
    return typeof once === 'string' ? JSON.parse(once) : once;
  } catch {
    return raw;
  }
};

const routes = ['/', ...slugs.map((slug) => `/preview/${slug}/`)];
const failures = [];

for (const [label, width, height] of [
  ['phone', 390, 844],
  ['small-phone', 320, 568],
  ['landscape', 844, 390],
  ['desktop', 1280, 900],
]) {
  browser('set', 'viewport', String(width), String(height));

  for (const route of routes) {
    browser('open', base + route);
    execFileSync('sleep', ['1.5']);
    evalJs("document.fonts.ready.then(()=>1); 'ok'");

    const states = route === '/' ? [0] : [0, 1, 2, 3, 4, 5];
    if (route !== '/') {
      evalJs(
        "(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('Buka Undangan'));if(b)b.click();return 'ok'})()"
      );
      execFileSync('sleep', ['1']);
    }

    for (const step of states) {
      if (step > 0) {
        evalJs(`(()=>{const c=document.querySelector('.overflow-y-auto');if(c)c.scrollTop=${step}*760;return 'ok'})()`);
        execFileSync('sleep', ['1']);
      }
      const raw = execFileSync('agent-browser', ['eval', '--stdin'], { input: auditScript, encoding: 'utf8' });
      const report = JSON.parse(JSON.parse(raw.trim()));
      const problems = {
        hOverflow: report.hOverflow,
        textOverlap: report.textOverlap,
        clipped: report.clipped,
        lowContrast: report.lowContrast,
        coverCta: report.coverCta && !report.coverCta.visible ? report.coverCta : [],
        reveal: route !== '/' && report.revealNodes < 5 ? { nodes: report.revealNodes } : [],
        nested: report.nestedReveals > 0 ? { nested: report.nestedReveals } : [],
        fonts: Object.entries(report.fonts).filter(([, ok]) => !ok),
      };
      const count = Object.values(problems).reduce((n, list) => n + list.length, 0);
      if (count) failures.push({ label, route, step, problems });
    }
    // Only the top-of-page state matters on the landing page.
    if (route === '/') continue;
    evalJs('(()=>{const c=document.querySelector(".overflow-y-auto");if(c)c.scrollTop=0;return "ok"})()');
  }
}

if (!failures.length) {
  console.log(`OK — ${routes.length} routes × 4 viewports, no layout defects.`);
  process.exit(0);
}

for (const failure of failures) {
  console.log(`\n✗ ${failure.label} ${failure.route} (scroll step ${failure.step})`);
  console.log(JSON.stringify(failure.problems, null, 1));
}
process.exit(1);
